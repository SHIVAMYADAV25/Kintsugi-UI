import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"
import Provider from "./provider"



const appFont = DM_Sans({
  subsets : ["latin"]
})

export const metadata: Metadata = {
  title: "UIUX generator App",
  description: "Generated High Quality free UIUX mobile and web mockup design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${appFont.className} antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}
