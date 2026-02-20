import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from '../../redux/slices/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    lat: '',
    lng: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        lat: profile.geolocation?.lat || '',
        lng: profile.geolocation?.lng || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      ...formData,
      geolocation:
        formData.lat && formData.lng
          ? {
              lat: parseFloat(formData.lat),
              lng: parseFloat(formData.lng),
            }
          : undefined,
    };
    delete updateData.lat;
    delete updateData.lng;
    dispatch(updateUserProfile(updateData));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location (Latitude, Longitude)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="lat"
              step="any"
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
            <input
              type="number"
              name="lng"
              step="any"
              value={formData.lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Get Location
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;

