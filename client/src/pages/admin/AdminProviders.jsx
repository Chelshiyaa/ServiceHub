import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProviders, updateProviderStatus } from '../../redux/slices/adminSlice';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProviders = () => {
  const dispatch = useDispatch();
  const { providers } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getProviders());
  }, [dispatch]);

  const handleStatusChange = async (providerId, newStatus) => {
    try {
      await dispatch(updateProviderStatus({ id: providerId, status: newStatus })).unwrap();
      dispatch(getProviders());
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Providers</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers && providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {provider.serviceName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{provider.ownerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{provider.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          provider.status
                        )}`}
                      >
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(provider._id, 'approved')}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Approve"
                        >
                          <FiCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(provider._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Reject"
                        >
                          <FiXCircle /> Reject
                        </button>
                        <button
                          onClick={() => handleStatusChange(provider._id, 'pending')}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1"
                          title="Set Pending"
                        >
                          <FiClock /> Pending
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProviders;

