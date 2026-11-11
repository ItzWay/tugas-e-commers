import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { deactivateProductAction } from "@/lib/actions";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Admin Produk" };
export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const query = await searchParams;
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return <><div className="section-heading"><h1>Kelola produk</h1><Link className="button" href="/admin/produk/tambah">Tambah produk</Link></div><Flash message={query.message}/><div className="table-wrap"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category.name}</td><td>{rupiah(product.price)}</td><td>{product.stock}</td><td><span className="badge">{product.isActive ? "Aktif" : "Nonaktif"}</span></td><td><div className="inline-form"><Link className="text-link" href={`/admin/produk/${product.id}/ubah`}>Ubah</Link>{product.isActive && <form action={deactivateProductAction}><input type="hidden" name="id" value={product.id}/><button className="small danger">Nonaktifkan</button></form>}</div></td></tr>)}</tbody></table></div></>;
}
