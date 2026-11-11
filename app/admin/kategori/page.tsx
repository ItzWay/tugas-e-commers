import { prisma } from "@/lib/prisma";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/actions";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Admin Kategori" };
export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams; const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
  return <><h1>Kelola kategori</h1><Flash error={query.error}/><form action={createCategoryAction} className="panel inline-form"><div><label htmlFor="new-name">Kategori baru</label><input id="new-name" name="name" maxLength={100} required/></div><button>Tambah</button></form><div className="stack">{categories.map((category) => <article className="panel category-row" key={category.id}><form action={updateCategoryAction} className="inline-form"><input type="hidden" name="id" value={category.id}/><div><label htmlFor={`name-${category.id}`}>Nama ({category._count.products} produk)</label><input id={`name-${category.id}`} name="name" defaultValue={category.name} maxLength={100} required/></div><button className="small">Simpan</button></form><form action={deleteCategoryAction}><input type="hidden" name="id" value={category.id}/><button className="small danger" disabled={category._count.products > 0}>Hapus</button></form></article>)}</div></>;
}
