import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { LoanApplicationForm } from '@/components/LoanApplicationForm';

export default function Apply() {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">New Loan Application</h1>
          
          <div className="mt-8">
            <div className="max-w-3xl mx-auto bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <LoanApplicationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}