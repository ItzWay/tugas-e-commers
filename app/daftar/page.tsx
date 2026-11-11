import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/lib/actions";
import { currentUser } from "@/lib/auth";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Daftar" };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await currentUser()) redirect("/produk");
  const query = await searchParams;
  return <section className="panel auth-panel"><p className="eyebrow">Akun baru</p><h1>Daftar</h1><Flash error={query.error}/><form action={registerAction} className="stack">
    <div><label htmlFor="name">Nama</label><input id="name" name="name" autoComplete="name" maxLength={100} required/></div>
    <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/></div>
    <div><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required/><small>Minimal 8 karakter.</small></div>
    <div><label htmlFor="confirmation">Konfirmasi password</label><input id="confirmation" name="password_confirmation" type="password" minLength={8} autoComplete="new-password" required/></div><button>Daftar</button>
  </form><p>Sudah punya akun? <Link className="text-link" href="/masuk">Masuk</Link>.</p></section>;
}
