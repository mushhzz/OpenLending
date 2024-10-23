import type { LoanApplication } from '@prisma/client';
import { formatCurrency } from '@/utils/format';

interface LoanApplicationCardProps {
  application: LoanApplication;
}

export function LoanApplicationCard({ application }: LoanApplicationCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    REVIEWING: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {application.loanType} Loan
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Created {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[application.status as keyof typeof statusColors]
            }`}
          >
            {application.status}
          </span>
        </div>
        <div className="mt-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
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
          </dl>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <a
            href={`/applications/${application.id}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            View details
          </a>
        </div>
      </div>
    </div>
  );
}