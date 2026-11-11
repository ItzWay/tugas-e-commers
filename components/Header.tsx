import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export async function Header() {
  const user = await currentUser();
  const count = user ? await prisma.cartItem.count({ where: { cart: { userId: user.id } } }) : 0;
  return <>
    <div className="demo-bar">DEMO TOKO — pembayaran dan pengiriman tidak diproses secara nyata</div>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark">J2M<span>JOK MOTOR</span></Link>
        <nav aria-label="Navigasi utama">
          <Link href="/produk">Produk</Link>
          {user ? <>
            <Link href="/keranjang">Keranjang ({count})</Link>
            <Link href="/pesanan">Pesanan</Link>
            {user.role === "admin" && <Link href="/admin">Admin</Link>}
            <form action={logoutAction}><button className="link-button">Keluar</button></form>
          </> : <>
            <Link href="/masuk">Masuk</Link>
            <Link href="/daftar" className="button small">Daftar</Link>
          </>}
        </nav>
      </div>
    </header>
  </>;
}
