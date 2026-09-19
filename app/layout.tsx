import "./globals.css";
import { Roboto_Slab, Public_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";


const publicSansHeading = Public_Sans({subsets:['latin'],variable:'--font-heading'});

const robotoSlab = Roboto_Slab({subsets:['latin'],variable:'--font-serif'});


export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-serif", robotoSlab.variable, publicSansHeading.variable)}>
      <body className="min-h-full flex flex-col">
         <Toaster position="top-right" richColors />
        {children}</body>
    </html>
  );
}
