import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Fira_Code } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { openGraph } from "@/lib/seo";
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
  openGraph: openGraph("/", { description }),
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#282c33" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
