import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { instrumentSans } from "./_styles/fonts";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "🦊 Kitsune AI",
  description: "Learn  the latest AI technologies from Shawn Esquivel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <Link rel="icon" href={"/favicon.ico"} />
      </Head>
      <body className={instrumentSans.className}>
        <Navbar />
        <main className="flex flex-col pt-20 px-20">{children}</main>
      </body>
      <Footer />
    </html>
  );
}
