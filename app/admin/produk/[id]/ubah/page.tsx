import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
export default async function EditProduct({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) { const [{ id }, query] = await Promise.all([params, searchParams]); const [product, categories] = await Promise.all([prisma.product.findUnique({ where: { id: Number(id) } }), prisma.category.findMany({ orderBy: { name: "asc" } })]); if (!product) notFound(); return <><h1>Ubah produk</h1><ProductForm product={product} categories={categories} error={query.error}/></>; }
