
import { redirect } from 'next/navigation';

export default function RootPage() {
  // We use (public) route group for the landing page.
  // Next.js will automatically use app/(public)/page.tsx for the root /.
  // This file is kept as an empty export to satisfy internal checks.
  return null;
}
