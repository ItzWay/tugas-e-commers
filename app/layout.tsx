import type { Metadata } from "next";
import "./globals.css";
import "./product-images.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "J2M Jok Motor", template: "%s | J2M" },
  description: "Toko demo bahan dan jok motor custom.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>
    <a href="#main" className="skip-link">Lewati ke konten</a>
    <Header />
    <main id="main" className="main container">{children}</main>
    <Footer />
  </body></html>;
}
