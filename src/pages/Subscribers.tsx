import { useState } from 'react';
import { useGetSubscribersQuery } from '../store/apiSlice';
import { Mail, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Subscribers() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetSubscribersQuery({ page, limit });

  const totalPages = data?.meta?.totalPage || 1;
  const subscribers = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a192f]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load subscribers</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-[#0a192f] to-[#0f3a4a] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-[#bef264]/20 p-3 rounded-2xl">
            <Mail className="w-8 h-8 text-[#bef264]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Newsletter Subscribers</h1>
            <p className="text-[#bef264] font-medium mt-1">Manage all subscribed emails</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-bold text-gray-700">Email Address</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: any) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="py-4 px-4 text-gray-500">
                    {format(new Date(sub.created_at), 'PPP')}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-500">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Showing page <span className="font-medium text-gray-900">{page}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
