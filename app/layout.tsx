import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { redirect } from "next/navigation";
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'; // Instala: npm install react-icons


const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], variable: '--font-lato' });

export const metadata: Metadata = {
  title: "MarfilYFresa | Elegant Jewelry",
  description: "Premium, minimalist jewelry store.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (data?.role === 'admin') isAdmin = true;
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans bg-mf-background text-mf-charcoal min-h-screen flex flex-col`}>
        
        {/* Elegant Glassmorphism Header */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-mf-charcoal">
              Marfil<span className="text-pink-400">Y</span>Fresa
            </Link>
            
            <nav className="flex items-center gap-6 font-medium">
              <Link href="/" className="hover:text-pink-400 transition-all duration-300 ease-in-out">Home</Link>
              <Link href="/wishlist" className="hover:text-pink-400 transition-all duration-300 ease-in-out">Wishlist</Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-pink-400 transition-all duration-300 ease-in-out text-mf-secondary">Admin</Link>
              )}
              
              {user ? (
                <form action={signOut}>
                  <button type="submit" className="bg-mf-primary hover:bg-pink-300 text-mf-charcoal font-semibold py-2 px-5 rounded-full transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
                    Logout
                  </button>
                </form>
              ) : (
                <Link href="/login" className="bg-mf-primary hover:bg-pink-300 text-mf-charcoal font-semibold py-2 px-5 rounded-full transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
                  Login
                </Link>
              )}
            </nav>
            <a href="https://wa.me/34605153154" target="_blank" className="bg-[#25D366] p-4 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
              <FaWhatsapp size={24} />
            </a>
            <a href="https://www.instagram.com/marfilyfresa/" target="_blank" className="bg-[#E1306C] p-4 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
              <FaInstagram size={24} />
            </a>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <ChatWindow />
        
        <footer className="bg-mf-charcoal text-mf-background py-8 text-center mt-12">
          <p className="font-serif tracking-widest text-sm">&copy; {new Date().getFullYear()} MARFIL Y FRESA. ALL RIGHTS RESERVED.</p>
        </footer>
      </body>
    </html>
  );
}