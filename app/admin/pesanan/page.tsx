import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rupiah, statusLabel, tanggal } from "@/lib/format";

export const metadata = { title: "Admin Pesanan" };
export default async function AdminOrders() { const orders = await prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }); return <><h1>Semua pesanan</h1><div className="table-wrap"><table><thead><tr><th>Nomor</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.number}</td><td>{order.user.name}<br/><small>{order.user.email}</small></td><td>{tanggal(order.createdAt)}</td><td>{rupiah(order.total)}</td><td><span className="badge">{statusLabel[order.status] || order.status}</span></td><td><Link className="text-link" href={`/admin/pesanan/${order.id}`}>Detail →</Link></td></tr>)}</tbody></table></div></>; }
