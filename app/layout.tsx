import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/context/DataContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DiabetesCareFlow — Integrated Diabetes Care & Hospital Operations Platform",
  description:
    "A unified frontend-only healthcare prototype integrating patient diabetes monitoring, OPD coordination, queue management, doctor consultations, bed availability, and hospital HRM.",
  keywords: [
    "diabetes care",
    "healthcare platform",
    "OPD management",
    "queue management",
    "bed management",
    "doctor workflow",
    "diabetes monitoring",
    "Time-in-Range",
  ],
  openGraph: {
    title: "DiabetesCareFlow — Integrated Diabetes Care & Hospital Operations Platform",
    description:
      "Connecting Patient Monitoring → Appointments → OPD → Queue → Doctor Consultations → Bed Management → HRM.",
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
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
