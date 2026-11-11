import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { statusLabel } from "@/lib/format";

export const metadata = { title: "Admin" };
export default async function AdminDashboard() {
  const [products, orders, grouped] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }), prisma.order.count(), prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
  ]);
  return <><div className="section-heading"><h1>Ringkasan toko</h1><Link className="button" href="/admin/produk/tambah">Tambah produk</Link></div><div className="stat-grid"><div className="panel"><p className="eyebrow">Produk aktif</p><p className="stat">{products}</p></div><div className="panel"><p className="eyebrow">Total pesanan</p><p className="stat">{orders}</p></div><div className="panel"><p className="eyebrow">Selesai</p><p className="stat">{grouped.find((x) => x.status === "completed")?._count.status || 0}</p></div></div><section className="panel"><h2>Status pesanan</h2>{grouped.length ? grouped.map((row) => <div className="order-row" key={row.status}><span>{statusLabel[row.status] || row.status}</span><strong>{row._count.status}</strong></div>) : <p>Belum ada pesanan.</p>}</section></>;
}
