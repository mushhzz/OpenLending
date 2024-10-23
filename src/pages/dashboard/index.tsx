import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { LoanApplicationCard } from '@/components/LoanApplicationCard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import type { LoanApplication } from '@prisma/client';

export default function Dashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await fetch('/api/loan-applications');
      const data = await response.json();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Your Applications</h2>
              <a
                href="/apply"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                New Application
              </a>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <LoanApplicationCard 
                  key={application.id} 
                  application={application} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}