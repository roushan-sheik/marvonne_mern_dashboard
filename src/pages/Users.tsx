import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserStatusMutation } from '../store/apiSlice';
import { Loader2, Trash2, User, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Users() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response, isLoading, error, isFetching } = useGetAllUsersQuery({ page, limit });
  const data = response?.data || [];
  const meta = response?.meta;
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState('');

  const users = data || [];

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete).unwrap();
      setUserToDelete(null);
      setToastMsg('User deleted successfully');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Failed to delete user');
      setUserToDelete(null);
    }
  };

  const handleToggleStatusClick = (user: any) => {
    setUserToToggleStatus(user);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;
    const newStatus = userToToggleStatus.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setUpdatingUserId(userToToggleStatus.id);
    try {
      await updateUserStatus({ id: userToToggleStatus.id, status: newStatus }).unwrap();
      setToastMsg(`User has been ${newStatus.toLowerCase()} successfully`);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Failed to update user status');
    } finally {
      setUserToToggleStatus(null);
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#0d9488] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-bold">Failed to load users</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-[#0a192f] to-[#0f3a4a] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-[#bef264]/20 p-3 rounded-2xl">
            <User className="w-8 h-8 text-[#bef264]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
            <p className="text-[#bef264] font-medium mt-1">Manage all registered users and their details</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-[#f8fafc] border-b border-gray-100 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.image ? (
                          <img className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200" src={user.image} alt={user.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0d9488]/20 to-[#0f3a4a]/20 flex items-center justify-center border border-gray-200">
                            <User className="h-5 w-5 text-[#0d9488]" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-extrabold text-[#0a192f]">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatusClick(user)}
                      disabled={isUpdatingStatus && updatingUserId === user.id}
                      className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
                      } ${(isUpdatingStatus && updatingUserId === user.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 shadow-sm'}`}
                    >
                      {(isUpdatingStatus && updatingUserId === user.id) ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : null}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors focus:outline-none"
                      disabled={isDeleting && userToDelete === user.id}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {meta && meta.total > meta.limit && (
            <div className="flex justify-center items-center p-6 border-t border-gray-100 bg-white space-x-4">
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

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-extrabold text-[#0a192f] mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 shadow-md shadow-red-500/20"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Status Toggle Confirmation Modal */}
      {userToToggleStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-extrabold text-[#0a192f] mb-2">
              {userToToggleStatus.status === 'ACTIVE' ? 'Block User?' : 'Unblock User?'}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to {userToToggleStatus.status === 'ACTIVE' ? 'block' : 'unblock'} <span className="font-bold text-gray-900">"{userToToggleStatus.name}"</span>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setUserToToggleStatus(null)}
                disabled={isUpdatingStatus}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={isUpdatingStatus}
                className={`flex-1 px-4 py-3 text-sm font-bold text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 shadow-md ${userToToggleStatus.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'}`}
              >
                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : (userToToggleStatus.status === 'ACTIVE' ? 'Block' : 'Unblock')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-[#0a192f] text-white px-5 py-3.5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-[#bef264] mr-3" />
          <p className="text-sm font-medium">{toastMsg}</p>
          <button onClick={() => setToastMsg('')} className="ml-4 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
