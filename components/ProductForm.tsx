import type { Category, Product } from "@prisma/client";
import { saveProductAction } from "@/lib/actions";
import { Flash } from "./Flash";

export function ProductForm({ product, categories, error }: { product?: Product; categories: Category[]; error?: string }) {
  return <><Flash error={error}/><form action={saveProductAction} className="panel stack form-width">
    <input type="hidden" name="id" value={product?.id || ""}/>
    <div><label htmlFor="name">Nama produk</label><input id="name" name="name" defaultValue={product?.name} maxLength={255} required/></div>
    <div><label htmlFor="categoryId">Kategori</label><select id="categoryId" name="categoryId" defaultValue={product?.categoryId} required><option value="">Pilih kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
    <div><label htmlFor="description">Deskripsi</label><textarea id="description" name="description" rows={6} maxLength={5000} defaultValue={product?.description} required/></div>
    <div><label htmlFor="price">Harga (rupiah)</label><input id="price" name="price" type="number" min="0" max="1000000000" defaultValue={product?.price || 0} required/></div>
    <div><label htmlFor="stock">Stok</label><input id="stock" name="stock" type="number" min="0" max="1000000" defaultValue={product?.stock || 0} required/></div>
    <label className="checkbox"><input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true}/><span>Tampilkan produk di katalog</span></label>
    <label className="checkbox"><input type="checkbox" name="requiresCustom" defaultChecked={product?.requiresCustom}/><span>Wajib mengisi tipe motor dan catatan custom</span></label>
    <button>Simpan produk</button>
  </form></>;
}
