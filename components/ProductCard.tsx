import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@prisma/client";
import { rupiah } from "@/lib/format";
import { productImage } from "@/lib/product-image";

export function ProductCard({ product }: { product: Product & { category: Category } }) {
  return <article className="product-card">
    <Link className="product-image-link" href={`/produk/${product.id}`}>
      <Image className="product-photo" src={productImage(product.name)} alt={product.name} fill sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw" />
      <span className="photo-label">{product.category.name}</span>
    </Link>
    <div className="product-body">
      <p className="eyebrow">{product.category.name}</p>
      <h3><Link href={`/produk/${product.id}`}>{product.name}</Link></h3>
      <p className="price">{rupiah(product.price)}</p>
      <p className="muted">Stok: {product.stock}</p>
      <Link className="text-link" href={`/produk/${product.id}`}>Lihat detail →</Link>
    </div>
  </article>;
}
