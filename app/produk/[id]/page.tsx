import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { addToCartAction } from "@/lib/actions";
import { currentUser } from "@/lib/auth";
import { Flash } from "@/components/Flash";
import { productImage } from "@/lib/product-image";

export default async function ProductDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const query = await searchParams;
  const product = await prisma.product.findFirst({ where: { id: Number(id), isActive: true }, include: { category: true } });
  if (!product) notFound();
  const user = await currentUser();
  return <>
    <Flash error={query.error}/>
    <div className="detail-grid">
      <div className="product-image-detail"><Image className="product-photo" src={productImage(product.name)} alt={product.name} fill priority sizes="(max-width: 800px) 100vw, 50vw" /><span className="photo-label">{product.category.name}</span></div>
      <section><p className="eyebrow">{product.category.name}</p><h1>{product.name}</h1><p className="price large-price">{rupiah(product.price)}</p><p className="muted">Stok tersedia: {product.stock}</p><p>{product.description}</p>
        {user ? <form action={addToCartAction} className="panel stack">
          <input type="hidden" name="productId" value={product.id}/>
          <div><label htmlFor="quantity">Jumlah</label><input id="quantity" name="quantity" type="number" min="1" max={Math.min(99, product.stock)} defaultValue="1" required/></div>
          {product.requiresCustom && <><div><label htmlFor="motorcycleType">Tipe motor</label><input id="motorcycleType" name="motorcycleType" maxLength={100} placeholder="Contoh: Honda Vario 160" required/></div><div><label htmlFor="requestNotes">Catatan permintaan</label><textarea id="requestNotes" name="requestNotes" rows={4} maxLength={1000} placeholder="Warna, motif, model jahitan, dan detail lainnya"/></div></>}
          <button disabled={product.stock < 1}>{product.stock < 1 ? "Stok habis" : "Tambah ke keranjang"}</button>
        </form> : <a className="button" href={`/masuk?message=${encodeURIComponent("Silakan masuk untuk menambahkan produk")}`}>Masuk untuk membeli</a>}
      </section>
    </div>
  </>;
}
