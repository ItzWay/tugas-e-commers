export function Footer() {
  return <footer className="site-footer"><div className="container">
    <strong>J2M — Jok Motor</strong>
    <p>Aplikasi demonstrasi e-commerce bahan dan jok motor custom. Semua transaksi, pembayaran, dan pengiriman di situs ini bersifat simulasi.</p>
    <small>© {new Date().getFullYear()} J2M. Dibangun dengan Next.js dan TypeScript.</small>
  </div></footer>;
}
