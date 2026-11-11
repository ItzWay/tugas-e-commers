import Link from "next/link";
export default function NotFound() { return <div className="panel empty-state"><p className="eyebrow">404</p><h1>Halaman tidak ditemukan</h1><p>Alamat yang dibuka tidak tersedia atau produknya sudah dinonaktifkan.</p><Link className="button" href="/">Kembali ke beranda</Link></div>; }
