import Link from "next/link";

export function AdminNav() {
  return <nav className="admin-nav" aria-label="Navigasi admin">
    <Link href="/admin">Ringkasan</Link>
    <Link href="/admin/produk">Produk</Link>
    <Link href="/admin/kategori">Kategori</Link>
    <Link href="/admin/pesanan">Pesanan</Link>
  </nav>;
}
