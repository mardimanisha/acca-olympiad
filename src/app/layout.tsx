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
    "A free 60-minute online Olympiad for Class 11 & 12 Commerce students. Discover your strengths, explore 16 career paths and get a personalized career report. 28 Nov 2026.",
};

export const viewport: Viewport = {
  themeColor: "#0b1a3d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
