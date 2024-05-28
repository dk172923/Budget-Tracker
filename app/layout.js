import { Inter,Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Budget Tracker",
  description: "Save money with us...",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      {/* <head>
      <script type='text/javascript' src='//pl23123991.profitablegatecpm.com/59/4a/39/594a3977a9246b4cb699f531c6dfb86f.js'></script>
      </head> */}
      <body className={outfit.className}>
      <Toaster />
        {children}</body>
    </html>
    </ClerkProvider>
  );
}
