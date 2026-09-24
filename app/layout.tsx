import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Diabriq — Connected Diabetes Care Network",
  description:
    "A connected operational platform for diabetes outpatient care. Coordinating patients, doctors, and hospitals across a city-wide network.",
  keywords: [
    "diabetes care",
    "healthcare network",
    "OPD management",
    "patient coordination",
    "hospital operations",
  ],
  openGraph: {
    title: "Diabriq — Connected Diabetes Care Network",
    description:
      "One connected network for better diabetes care operations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
