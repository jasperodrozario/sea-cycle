import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "SeaCycle - Cleaning Our Oceans",
  description:
    "SeaCycle uses AI, IoT Drones, and Blockchain to create a transparent and efficient ecosystem for marine waste management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sourceSans.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
