import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { checkoutAction } from "@/lib/actions";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Checkout" };
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser(); const query = await searchParams;
  const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true } } } });
  if (!cart?.items.length) redirect("/keranjang?message=Tambahkan produk terlebih dahulu");
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return <><p className="eyebrow">Tahap akhir</p><h1>Checkout simulasi</h1><Flash error={query.error}/><div className="checkout-grid">
    <form action={checkoutAction} className="panel stack"><h2>Informasi penerima</h2><div><label htmlFor="recipientName">Nama penerima</label><input id="recipientName" name="recipientName" defaultValue={user.name} maxLength={100} required/></div><div><label htmlFor="address">Alamat lengkap</label><textarea id="address" name="address" rows={5} minLength={10} maxLength={1000} required/></div><div><label>Pengiriman</label><input value="Simulasi — gratis" readOnly/></div><div><label>Pembayaran</label><input value="Simulasi — tidak ada transaksi nyata" readOnly/></div><label className="checkbox"><input type="checkbox" name="agreement" required/><span>Saya memahami bahwa checkout ini hanya simulasi dan tidak menimbulkan pembayaran atau pengiriman nyata.</span></label><button>Konfirmasi pesanan</button></form>
    <aside className="panel"><h2>Ringkasan</h2>{cart.items.map((item) => <div className="order-row" key={item.id}><p>{item.product.name}<br/><small>{item.quantity} × {rupiah(item.product.price)}</small></p><strong>{rupiah(item.quantity * item.product.price)}</strong></div>)}<hr/><div className="order-row"><strong>Total</strong><strong>{rupiah(total)}</strong></div></aside>
  </div></>;
}
