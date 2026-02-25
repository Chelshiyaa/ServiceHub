import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiMapPin,
  FiArrowRight,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import easysearch from "../../assets/easysearch.jpg";
import localicon from "../../assets/localicon.jpg";
import trustedproviders from "../../assets/trustedprovider.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success("Location captured!");
        setLoadingLocation(false);
      },
      (error) => {
        toast.error(error.message);
        setLoadingLocation(false);
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to search for services");
      navigate("/login");
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery) params.append("service", searchQuery);
    if (location.lat) params.append("lat", location.lat);
    if (location.lng) params.append("lng", location.lng);
    params.append("radius", "50");

    navigate(`/search?${params.toString()}`);
  };

  const features = [
    {
      icon: easysearch,
      title: "Easy Search",
      description:
        "Find services by type, location, and distance with our powerful search engine.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: trustedproviders,
      title: "Trusted Providers",
      description:
        "All service providers are verified and reviewed by our community.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: localicon,
      title: "Local Services",
      description:
        "Connect with professionals in your neighborhood quickly and easily.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-20">

        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 text-primary-700">
            Find Local Services <br /> Near You
          </h1>

          <p className="text-xl text-gray-600 mb-10">
            Search, compare, and connect with trusted service providers.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loadingLocation}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg flex items-center gap-2"
              >
                <FiMapPin />
                {loadingLocation ? "Getting..." : "Location"}
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg flex items-center gap-2"
              >
                Search
                <FiArrowRight />
              </button>
            </div>
          </form>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition"
            >
              <div
                className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5`}
              >
                {typeof feature.icon === "string" ? (
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <feature.icon className="text-3xl text-primary-600" />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {!user && (
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Join now and find the best local services.
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold"
            >
              Sign Up Free
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;