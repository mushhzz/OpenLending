import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}