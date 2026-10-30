import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SideSocialBar } from "@/components/layout/side-social-bar";
import { socials } from "@/lib/site";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahmoud Ebeid",
  description: "Backend engineer and full-stack developer based in Cairo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <a
          href="#main"
          className="sr-only z-50 bg-background px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:border focus:border-primary"
        >
          Skip to content
        </a>
        <SideSocialBar links={socials} />
        <Header name="Mahmoud" socials={socials} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer
          name="Mahmoud"
          email="mahmoud.ebeid2002@gmail.com"
          tagline="Backend engineer and full-stack developer"
          socials={socials}
        />
      </body>
    </html>
  );
}
