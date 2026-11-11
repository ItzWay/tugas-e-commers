"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, requireUser } from "./auth";
import { prisma } from "./prisma";

const text = (data: FormData, key: string) => String(data.get(key) || "").trim();
const number = (data: FormData, key: string) => Number(data.get(key));
function goError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(data: FormData) {
  const email = text(data, "email").toLowerCase();
  const password = text(data, "password");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) goError("/masuk", "Email atau password tidak sesuai.");
  await createSession(user.id);
  redirect(user.role === "admin" ? "/admin" : "/produk");
}

export async function registerAction(data: FormData) {
  const name = text(data, "name");
  const email = text(data, "email").toLowerCase();
  const password = text(data, "password");
  const confirmation = text(data, "password_confirmation");
  if (name.length < 2 || !email.includes("@")) goError("/daftar", "Nama atau email tidak valid.");
  if (password.length < 8 || password !== confirmation) goError("/daftar", "Password minimal 8 karakter dan konfirmasi harus sama.");
  if (await prisma.user.findUnique({ where: { email } })) goError("/daftar", "Email sudah digunakan.");
  const user = await prisma.user.create({ data: { name, email, password: await bcrypt.hash(password, 12) } });
  await createSession(user.id);
  redirect("/produk");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function addToCartAction(data: FormData) {
  const user = await requireUser();
  const productId = number(data, "productId");
  const quantity = number(data, "quantity");
  const motorcycleType = text(data, "motorcycleType") || null;
  const requestNotes = text(data, "requestNotes") || null;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product?.isActive) goError(`/produk/${productId}`, "Produk tidak tersedia.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) goError(`/produk/${productId}`, "Jumlah harus antara 1 sampai 99.");
  if (product.requiresCustom && !motorcycleType) goError(`/produk/${productId}`, "Tipe motor wajib diisi.");
  const cart = await prisma.cart.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  const total = await prisma.cartItem.aggregate({ where: { cartId: cart.id, productId }, _sum: { quantity: true } });
  if ((total._sum.quantity || 0) + quantity > product.stock) goError(`/produk/${productId}`, "Jumlah melebihi stok yang tersedia.");
  const matching = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, motorcycleType, requestNotes } });
  if (matching) await prisma.cartItem.update({ where: { id: matching.id }, data: { quantity: matching.quantity + quantity } });
  else await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, motorcycleType: product.requiresCustom ? motorcycleType : null, requestNotes: product.requiresCustom ? requestNotes : null } });
  revalidatePath("/keranjang");
  redirect("/keranjang?message=Produk ditambahkan ke keranjang");
}

export async function updateCartAction(data: FormData) {
  const user = await requireUser();
  const itemId = number(data, "itemId");
  const quantity = number(data, "quantity");
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId: user.id } }, include: { product: true, cart: { include: { items: true } } } });
  if (!item) goError("/keranjang", "Item tidak ditemukan.");
  const others = item.cart.items.filter((x) => x.productId === item.productId && x.id !== item.id).reduce((sum, x) => sum + x.quantity, 0);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99 || others + quantity > item.product.stock) goError("/keranjang", "Jumlah tidak valid atau stok tidak cukup.");
  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  revalidatePath("/keranjang");
}

export async function removeCartAction(data: FormData) {
  const user = await requireUser();
  const itemId = number(data, "itemId");
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId: user.id } } });
  if (item) await prisma.cartItem.delete({ where: { id: item.id } });
  revalidatePath("/keranjang");
}

export async function checkoutAction(data: FormData) {
  const user = await requireUser();
  const recipientName = text(data, "recipientName");
  const address = text(data, "address");
  const agreement = data.get("agreement") === "on";
  if (recipientName.length < 2 || address.length < 10 || !agreement) goError("/checkout", "Lengkapi nama, alamat minimal 10 karakter, dan persetujuan simulasi.");
  const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true } } } });
  if (!cart?.items.length) goError("/keranjang", "Keranjang masih kosong.");
  const cartId = cart.id;
  let orderId = 0;
  try {
    const order = await prisma.$transaction(async (tx) => {
      const fresh = await tx.cart.findUnique({ where: { id: cartId }, include: { items: { include: { product: true } } } });
      if (!fresh?.items.length) throw new Error("Keranjang kosong.");
      for (const item of fresh.items) {
        if (!item.product.isActive || item.quantity > item.product.stock) throw new Error(`Stok ${item.product.name} tidak cukup.`);
      }
      const total = fresh.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const created = await tx.order.create({ data: {
        userId: user.id, checkoutToken: randomUUID(), number: `J2M-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        recipientName, address, total,
        items: { create: fresh.items.map((item) => ({ productId: item.productId, productName: item.product.name, unitPrice: item.product.price, quantity: item.quantity, subtotal: item.product.price * item.quantity, motorcycleType: item.motorcycleType, requestNotes: item.requestNotes })) },
      }});
      for (const item of fresh.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      await tx.cartItem.deleteMany({ where: { cartId: fresh.id } });
      return created;
    });
    orderId = order.id;
  } catch (error) {
    goError("/checkout", error instanceof Error ? error.message : "Checkout gagal.");
  }
  revalidatePath("/keranjang");
  redirect(`/pesanan/${orderId}?message=Pesanan simulasi berhasil dibuat`);
}

export async function saveProductAction(data: FormData) {
  await requireAdmin();
  const id = number(data, "id");
  const payload = {
    name: text(data, "name"), categoryId: number(data, "categoryId"), description: text(data, "description"),
    price: number(data, "price"), stock: number(data, "stock"), isActive: data.get("isActive") === "on", requiresCustom: data.get("requiresCustom") === "on",
  };
  if (!payload.name || !payload.description || !Number.isInteger(payload.price) || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0) goError(id ? `/admin/produk/${id}/ubah` : "/admin/produk/tambah", "Data produk belum valid.");
  if (id) await prisma.product.update({ where: { id }, data: payload }); else await prisma.product.create({ data: payload });
  revalidatePath("/admin/produk"); revalidatePath("/produk");
  redirect("/admin/produk?message=Produk berhasil disimpan");
}

export async function deactivateProductAction(data: FormData) {
  await requireAdmin();
  await prisma.product.update({ where: { id: number(data, "id") }, data: { isActive: false } });
  revalidatePath("/admin/produk"); revalidatePath("/produk");
}

export async function createCategoryAction(data: FormData) {
  await requireAdmin();
  const name = text(data, "name");
  if (!name) goError("/admin/kategori", "Nama kategori wajib diisi.");
  try { await prisma.category.create({ data: { name } }); } catch { goError("/admin/kategori", "Nama kategori sudah digunakan."); }
  revalidatePath("/admin/kategori");
}

export async function updateCategoryAction(data: FormData) {
  await requireAdmin();
  const id = number(data, "id"); const name = text(data, "name");
  if (!name) goError("/admin/kategori", "Nama kategori wajib diisi.");
  try { await prisma.category.update({ where: { id }, data: { name } }); } catch { goError("/admin/kategori", "Kategori gagal diperbarui."); }
  revalidatePath("/admin/kategori");
}

export async function deleteCategoryAction(data: FormData) {
  await requireAdmin();
  const id = number(data, "id");
  if (await prisma.product.count({ where: { categoryId: id } })) goError("/admin/kategori", "Pindahkan semua produk sebelum menghapus kategori.");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
}

export async function updateOrderStatusAction(data: FormData) {
  await requireAdmin();
  const id = number(data, "id"); const status = text(data, "status");
  const order = await prisma.order.findUnique({ where: { id } });
  const next: Record<string, string> = { created: "processing", processing: "completed" };
  if (!order || next[order.status] !== status) goError(`/admin/pesanan/${id}`, "Status hanya dapat maju satu tahap.");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/pesanan/${id}`); revalidatePath(`/pesanan/${id}`);
}
