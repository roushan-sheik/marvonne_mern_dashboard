import { useState } from 'react';
import { useGetAllOrdersQuery, useGetGelatoStatsQuery } from '../store/apiSlice';
import { ShoppingCart, ChevronLeft, ChevronRight, Printer, Package, Truck, CheckCircle, PackageOpen } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  format: string;
  book?: {
    story?: {
      title: string;
    };
  };
}

interface Order {
  id: string;
  user?: {
    name: string;
    email: string;
  };
  items?: OrderItem[];
  total_amount?: number;
  status: string;
  fulfillment_status?: string | null;
  created_at: string;
}

const Orders = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response, isLoading, isError, isFetching } = useGetAllOrdersQuery({ page, limit });
  const { data: statsResponse } = useGetGelatoStatsQuery(undefined);
  const orders: Order[] = response?.data || [];
  const meta = response?.meta;
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bef264]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load orders. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-[#0a192f] to-[#0f3a4a] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-[#bef264]/20 p-3 rounded-2xl">
            <ShoppingCart className="w-8 h-8 text-[#bef264]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management</h1>
            <p className="text-[#bef264] font-medium mt-1">Review all platform purchases</p>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6 sm:px-10 pt-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg"><Printer className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Total Printed</p>
              <p className="text-lg font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
            <div className="bg-yellow-50 p-2 rounded-lg"><PackageOpen className="w-5 h-5 text-yellow-500" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">In Production</p>
              <p className="text-lg font-bold text-gray-900">{stats.inProduction || 0}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg"><Package className="w-5 h-5 text-purple-500" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Printed</p>
              <p className="text-lg font-bold text-gray-900">{stats.printed || 0}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg"><Truck className="w-5 h-5 text-orange-500" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Shipped</p>
              <p className="text-lg font-bold text-gray-900">{stats.shipped || 0}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
            <div className="bg-green-50 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-500" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Delivered</p>
              <p className="text-lg font-bold text-gray-900">{stats.delivered || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-10">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-600 font-semibold uppercase text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Order ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Items / Book</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-xl">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/30">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{order.user?.name || 'Unknown'}</span>
                        <span className="text-gray-500 text-xs">{order.user?.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.items?.map((item: OrderItem) => (
                        <div key={item.id} className="mb-2 last:mb-0">
                          <span className="font-semibold text-[#0a192f]">{item.book?.story?.title || 'Personalized Story'}</span>
                          <span className="ml-2 text-xs font-bold text-white px-2 py-0.5 rounded-full bg-[#3CCFBD]">
                            {item.format}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0a192f]">
                      ${order.total_amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'PENDING_PAYMENT'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.fulfillment_status && (
                          <span className="w-fit px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                            {order.fulfillment_status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                      {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {meta && meta.total > meta.limit && (
            <div className="flex justify-center items-center p-6 border-t border-gray-100 bg-white space-x-4 rounded-b-xl">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(meta.total / meta.limit), p + 1))}
                disabled={page >= Math.ceil(meta.total / meta.limit) || isFetching}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
