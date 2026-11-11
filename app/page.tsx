import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, include: { category: true }, take: 6, orderBy: { name: "asc" } });
  return <>
    <section className="hero">
      <div><p className="eyebrow">Bahan & jok motor custom</p><h1>Buat jok motor yang nyaman dan punya karakter.</h1>
        <p className="hero-copy">Pilih bahan jok, busa, latex, tulangan, atau pesan satu set jok custom sesuai tipe motor dan gaya pilihan Anda.</p>
        <div className="hero-actions"><Link className="button" href="/produk">Lihat produk</Link><Link className="button secondary" href="/produk?category=2">Pesan jok custom</Link></div>
      </div>
      <div className="hero-panel"><span>J2M</span><div><strong>JOK MOTOR</strong><br/><small>Material pilihan. Hasil sesuai permintaan.</small></div></div>
    </section>
    <section><div className="section-heading"><div><p className="eyebrow">Pilihan toko</p><h2>Produk tersedia</h2></div><Link className="text-link" href="/produk">Semua produk →</Link></div>
      <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
    <aside className="info-strip"><h2>Belanja tanpa bingung</h2><p>Harga, stok, dan detail permintaan custom ditampilkan dengan jelas. Aplikasi ini adalah demo sehingga tidak memproses pembayaran maupun pengiriman sebenarnya.</p></aside>
  </>;
}
