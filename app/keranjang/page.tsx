import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { productImage } from "@/lib/product-image";
import {
  removeCartAction,
  updateCartAction,
} from "@/lib/actions";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Keranjang" };

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
}) {
  const user = await requireUser();
  const query = await searchParams;

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });

  const items = cart?.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0,
  );

  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Belanja Anda</p>
          <h1>Keranjang</h1>
        </div>

        <Link href="/produk" className="text-link">
          Lanjut belanja →
        </Link>
      </div>

      <Flash
        message={query.message}
        error={query.error}
      />

      {!items.length ? (
        <div className="panel empty-state">
          <h2>Keranjang masih kosong</h2>
          <p>Pilih bahan atau jok custom dari katalog.</p>

          <Link className="button" href="/produk">
            Lihat produk
          </Link>
        </div>
      ) : (
        <>
          <div className="panel stack">
            {items.map((item) => (
              <article className="cart-line" key={item.id}>
                <div className="cart-product-info">
                  <Link
                    href={`/produk/${item.product.id}`}
                    className="cart-image-wrapper"
                  >
                    <Image
                      src={productImage(item.product.name)}
                      alt={item.product.name}
                      width={150}
                      height={120}
                      className="cart-product-photo"
                    />
                  </Link>

                  <div>
                    <h2>{item.product.name}</h2>

                    <p>
                      {rupiah(item.product.price)} ×{" "}
                      {item.quantity}
                    </p>

                    {item.motorcycleType && (
                      <p>
                        <strong>Tipe motor:</strong>{" "}
                        {item.motorcycleType}
                      </p>
                    )}

                    {item.requestNotes && (
                      <p className="preserve">
                        <strong>Catatan:</strong>{" "}
                        {item.requestNotes}
                      </p>
                    )}

                    <p className="price">
                      {rupiah(
                        item.product.price *
                          item.quantity,
                      )}
                    </p>
                  </div>
                </div>

                <div className="cart-actions">
                  <form action={updateCartAction}>
                    <input
                      type="hidden"
                      name="itemId"
                      value={item.id}
                    />

                    <label htmlFor={`qty-${item.id}`}>
                      Jumlah
                    </label>

                    <input
                      id={`qty-${item.id}`}
                      name="quantity"
                      type="number"
                      min="1"
                      max="99"
                      defaultValue={item.quantity}
                    />

                    <button className="small">
                      Ubah
                    </button>
                  </form>

                  <form action={removeCartAction}>
                    <input
                      type="hidden"
                      name="itemId"
                      value={item.id}
                    />

                    <button className="small danger">
                      Hapus
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>

          <div className="panel summary">
            <span>Total</span>
            <strong>{rupiah(total)}</strong>

            <p>
              <small>
                Ongkir simulasi: {rupiah(0)}
              </small>
            </p>

            <Link className="button" href="/checkout">
              Lanjut checkout
            </Link>
          </div>
        </>
      )}
    </>
  );
}