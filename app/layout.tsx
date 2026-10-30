import type { Metadata, Viewport } from "next";
import { Fira_Code } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Mahmoud Ebeid is a backend engineer and full-stack developer in Cairo, building SaaS platforms, payment engines and the web & mobile apps on top of them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mahmoud Ebeid — Backend engineer & full-stack developer",
    template: "%s | Mahmoud Ebeid",
  },
  description,
  applicationName: "Mahmoud Ebeid",
  authors: [{ name: "Mahmoud Ebeid", url: siteUrl }],
  creator: "Mahmoud Ebeid",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Mahmoud Ebeid",
    locale: "en_US",
    url: "/",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#282c33",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
