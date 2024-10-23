import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { formatCurrency } from '@/utils/format';
import type { LoanApplication, Document } from '@prisma/client';

type ApplicationWithDocuments = LoanApplication & {
  documents: Document[];
};

export default function ApplicationDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState<ApplicationWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/loan-applications/${id}`)
        .then(res => res.json())
        .then(data => {
          setApplication(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch application:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-red-600">Application not found</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Loan Application Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Application ID: {application.id}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Loan Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.loanType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(application.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Term</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.term} years</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.status}</dd>
                </div>
                {application.documents.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Documents</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {application.documents.map((doc) => (
                          <li key={doc.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <span className="ml-2 flex-1 w-0 truncate">
                                {doc.type}
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a
                                href={doc.blobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                View
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}