import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Admin · National Commerce Olympiad 2026",
  robots: { index: false, follow: false },
};

/** Partner institutes and their registration links. Signs in with ADMIN_PASSWORD; see `src/lib/admin-auth.ts`. */
export default function AdminPage() {
  return <AdminPanel />;
}
