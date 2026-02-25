import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/userSlice";

import {
  FiArrowRight,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

// ✅ IMAGE IMPORTS
import myprofile from "../../assets/myprofile.jpg";
import favourites from "../../assets/favourites.jpg";
import searchservices from "../../assets/searchservices.jpg";
import mybooking from "../../assets/mybooking.jpg";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const cards = [
    {
      icon: myprofile,
      title: "My Profile",
      description: "View and edit your profile information",
      link: "/user/profile",
      bgColor: "bg-blue-50",
    },
    {
      icon: favourites,
      title: "Favorites",
      description: `${profile?.favorites?.length || 0} saved providers`,
      link: "/user/favorites",
      bgColor: "bg-red-50",
    },
    {
      icon: searchservices,
      title: "Search Services",
      description: "Find service providers near you",
      link: "/search",
      bgColor: "bg-primary-50",
    },
    {
      icon: mybooking,
      title: "My Bookings",
      description: "View your service bookings",
      link: "/user/bookings",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Manage your account and services
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center mb-6`}
              >
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-8 h-8 object-contain"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 mb-4">{card.description}</p>

              <div className="flex items-center text-primary-600 font-semibold">
                <span>View Details</span>
                <FiArrowRight className="ml-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* PROFILE INFO */}
        {profile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 animate-fade-in-up animation-delay-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Full Name" value={profile.name} />
              <InfoCard
                label="Email"
                value={profile.email}
                icon={<FiMail />}
              />
              {profile.phone && (
                <InfoCard
                  label="Phone"
                  value={profile.phone}
                  icon={<FiPhone />}
                />
              )}
              {profile.address && (
                <InfoCard
                  label="Address"
                  value={profile.address}
                  icon={<FiMapPin />}
                />
              )}
            </div>
          </div>
        )}
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
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xl">
      {icon || label.charAt(0)}
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default UserDashboard;