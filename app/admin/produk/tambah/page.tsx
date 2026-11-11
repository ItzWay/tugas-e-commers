import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
export const metadata = { title: "Tambah Produk" };
export default async function AddProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const [categories, query] = await Promise.all([prisma.category.findMany({ orderBy: { name: "asc" } }), searchParams]); return <><h1>Tambah produk</h1><ProductForm categories={categories} error={query.error}/></>; }
