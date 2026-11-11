import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rupiah, statusLabel, tanggal } from "@/lib/format";

export const metadata = { title: "Pesanan" };
export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return <><p className="eyebrow">Akun Anda</p><h1>Riwayat pesanan</h1>{orders.length ? <div className="stack">{orders.map((order) => <article className="panel order-row" key={order.id}><div><span className="badge">{statusLabel[order.status] || order.status}</span><h2 className="order-number">{order.number}</h2><p className="muted">{tanggal(order.createdAt)}</p></div><div><p className="price">{rupiah(order.total)}</p><Link className="text-link" href={`/pesanan/${order.id}`}>Lihat detail →</Link></div></article>)}</div> : <div className="panel empty-state"><h2>Belum ada pesanan</h2><Link className="button" href="/produk">Mulai belanja</Link></div>}</>;
}
