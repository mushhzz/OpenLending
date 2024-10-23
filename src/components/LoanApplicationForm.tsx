import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';

const loanApplicationSchema = z.object({
  loanType: z.enum(['PERSONAL', 'BUSINESS', 'PROPERTY']),
  amount: z.number().min(1000).max(10000000),
  term: z.number().min(1).max(30),
  tfn: z.string().regex(/^\d{9}$/, 'Invalid TFN format'),
  abnAcn: z.string().optional(),
  propertyState: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']).optional(),
});

type LoanApplicationData = z.infer<typeof loanApplicationSchema>;

export function LoanApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoanApplicationData>({
    resolver: zodResolver(loanApplicationSchema),
  });

  const loanType = watch('loanType');

  const onSubmit = async (data: LoanApplicationData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to submit application');
      
      const result = await response.json();
      window.location.href = `/applications/${result.id}`;
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Loan Type</label>
        <select
          {...register('loanType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="PERSONAL">Personal Loan</option>
          <option value="BUSINESS">Business Loan</option>
          <option value="PROPERTY">Property Loan</option>
        </select>
        {errors.loanType && (
          <p className="mt-1 text-sm text-red-600">{errors.loanType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Loan Amount (AUD)</label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
        <input
          type="number"
          {...register('term', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.term && (
          <p className="mt-1 text-sm text-red-600">{errors.term.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tax File Number (TFN)</label>
        <input
          type="text"
          {...register('tfn')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.tfn && (
          <p className="mt-1 text-sm text-red-600">{errors.tfn.message}</p>
        )}
      </div>

      {loanType === 'BUSINESS' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">ABN/ACN</label>
          <input
            type="text"
            {...register('abnAcn')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.abnAcn && (
            <p className="mt-1 text-sm text-red-600">{errors.abnAcn.message}</p>
          )}
        </div>
      )}

      {loanType === 'PROPERTY' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Property State</label>
          <select
            {...register('propertyState')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="NSW">New South Wales</option>
            <option value="VIC">Victoria</option>
            <option value="QLD">Queensland</option>
            <option value="WA">Western Australia</option>
            <option value="SA">South Australia</option>
            <option value="TAS">Tasmania</option>
            <option value="NT">Northern Territory</option>
            <option value="ACT">Australian Capital Territory</option>
          </select>
          {errors.propertyState && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyState.message}</p>
          )}
        </div>
      )}

      <DocumentUpload />

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}