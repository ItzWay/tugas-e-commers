import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { currentUser } from "@/lib/auth";
import { Flash } from "@/components/Flash";

export const metadata = { title: "Masuk" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  if (await currentUser()) redirect("/produk");
  const query = await searchParams;
  return <section className="panel auth-panel"><p className="eyebrow">Akun pelanggan</p><h1>Masuk</h1><Flash message={query.message} error={query.error}/><form action={loginAction} className="stack">
    <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/></div>
    <div><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required/></div><button>Masuk</button>
  </form><p>Belum punya akun? <Link className="text-link" href="/daftar">Daftar sekarang</Link>.</p></section>;
}
