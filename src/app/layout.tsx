import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "National Commerce Olympiad 2027 · ZSkillup",
  description:
    "A free 60-minute online Olympiad for Commerce Students. Discover your strengths, explore 16 career paths and get a personalized career report. 20 Dec 2026.",
};

export const viewport: Viewport = {
  themeColor: "#0b1a3d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        {/* Assets load from the project origin even when the page is reached via zskillup.com. */}
        <link rel="preconnect" href="https://acca-olympiad.vercel.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://acca-olympiad.vercel.app" />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
