import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Produk" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const query = await searchParams;
  const categoryId = Number(query.category) || undefined;
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true, ...(query.q ? { name: { contains: query.q } } : {}), ...(categoryId ? { categoryId } : {}) }, include: { category: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <>
    <div className="section-heading"><div><p className="eyebrow">Katalog J2M</p><h1>Produk</h1></div><span className="muted">{products.length} produk ditemukan</span></div>
    <form className="filter-bar">
      <div><label htmlFor="q">Cari produk</label><input id="q" name="q" defaultValue={query.q} placeholder="Contoh: kulit jok" maxLength={100}/></div>
      <div><label htmlFor="category">Kategori</label><select id="category" name="category" defaultValue={query.category || ""}><option value="">Semua kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
      <button type="submit">Terapkan</button><Link href="/produk">Reset</Link>
    </form>
    <div className="product-grid">{products.length ? products.map((product) => <ProductCard key={product.id} product={product}/>) : <div className="panel empty-state"><h2>Produk tidak ditemukan</h2><p>Coba ubah kata pencarian atau kategori.</p></div>}</div>
  </>;
}
