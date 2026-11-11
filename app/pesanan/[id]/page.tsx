import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rupiah, statusLabel, tanggal } from "@/lib/format";
import { Flash } from "@/components/Flash";

export default async function OrderDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> }) {
  const user = await requireUser(); const { id } = await params; const query = await searchParams;
  const order = await prisma.order.findFirst({ where: { id: Number(id), userId: user.id }, include: { items: true } });
  if (!order) notFound();
  return <><Flash message={query.message}/><div className="section-heading"><div><p className="eyebrow">Detail pesanan</p><h1 className="order-number">{order.number}</h1></div><span className="badge">{statusLabel[order.status] || order.status}</span></div>
    <div className="checkout-grid"><section className="panel"><h2>Item pesanan</h2>{order.items.map((item) => <article key={item.id} className="order-row"><div><h3>{item.productName}</h3><p>{item.quantity} × {rupiah(item.unitPrice)}</p>{item.motorcycleType && <p><strong>Tipe motor:</strong> {item.motorcycleType}</p>}{item.requestNotes && <p className="preserve"><strong>Catatan:</strong> {item.requestNotes}</p>}</div><strong>{rupiah(item.subtotal)}</strong></article>)}<hr/><div className="order-row"><strong>Total</strong><strong>{rupiah(order.total)}</strong></div></section>
      <aside className="panel"><h2>Informasi</h2><p><strong>Dibuat:</strong><br/>{tanggal(order.createdAt)}</p><p><strong>Penerima:</strong><br/>{order.recipientName}</p><p className="preserve"><strong>Alamat:</strong><br/>{order.address}</p><p><strong>Metode:</strong><br/>Pembayaran dan pengiriman simulasi</p></aside></div>
  </>;
}
