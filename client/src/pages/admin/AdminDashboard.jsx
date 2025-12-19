import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../redux/slices/adminSlice';
import { FiUsers, FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiTag, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getStats());
    }
  }, [dispatch, user?.role]);

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FiBriefcase,
      label: 'Total Providers',
      value: stats?.totalProviders || 0,
      gradient: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: FiClock,
      label: 'Pending Providers',
      value: stats?.pendingProviders || 0,
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: FiCheckCircle,
      label: 'Approved Providers',
      value: stats?.approvedProviders || 0,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FiXCircle,
      label: 'Rejected Providers',
      value: stats?.rejectedProviders || 0,
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: FiTag,
      label: 'Categories',
      value: stats?.totalCategories || 0,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      link: '/admin/users',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Manage Providers',
      description: 'Approve, reject, and manage providers',
      link: '/admin/providers',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Manage Categories',
      description: 'Add, edit, and delete service categories',
      link: '/admin/categories',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage your platform and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`text-3xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20 animate-fade-in-up"
              style={{ animationDelay: `${(index + 6) * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{action.title}</h2>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-primary-600 font-semibold">
                <span>Go to {action.title}</span>
                <FiArrowRight className="ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
