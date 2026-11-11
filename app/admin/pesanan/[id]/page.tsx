import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rupiah, statusLabel, tanggal } from "@/lib/format";
import { updateOrderStatusAction } from "@/lib/actions";
import { Flash } from "@/components/Flash";

export default async function AdminOrderDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]); const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true, user: true } }); if (!order) notFound();
  const next = order.status === "created" ? "processing" : order.status === "processing" ? "completed" : null;
  return <><Flash error={query.error}/><div className="section-heading"><div><p className="eyebrow">Pesanan {order.user.name}</p><h1 className="order-number">{order.number}</h1></div><span className="badge">{statusLabel[order.status] || order.status}</span></div><div className="checkout-grid"><section className="panel"><h2>Item</h2>{order.items.map((item) => <div className="order-row" key={item.id}><div><strong>{item.productName}</strong><p>{item.quantity} × {rupiah(item.unitPrice)}</p>{item.motorcycleType && <p>Tipe motor: {item.motorcycleType}</p>}{item.requestNotes && <p className="preserve">{item.requestNotes}</p>}</div><strong>{rupiah(item.subtotal)}</strong></div>)}<hr/><div className="order-row"><strong>Total</strong><strong>{rupiah(order.total)}</strong></div></section><aside className="panel"><h2>Penerima</h2><p>{order.recipientName}<br/>{order.user.email}</p><p className="preserve">{order.address}</p><p>{tanggal(order.createdAt)}</p>{next && <form action={updateOrderStatusAction}><input type="hidden" name="id" value={order.id}/><input type="hidden" name="status" value={next}/><button>Ubah ke {statusLabel[next]}</button></form>}</aside></div></>;
}
