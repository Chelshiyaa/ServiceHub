import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProviderProfile, updateProviderProfile } from '../../redux/slices/providerSlice';

const ProviderProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.provider);
  const [formData, setFormData] = useState({
    ownerName: '',
    serviceName: '',
    description: '',
    phone: '',
    address: '',
    lat: '',
    lng: '',
    category: '',
    pricing: '',
    skills: '',
    experience: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    dispatch(getProviderProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        ownerName: profile.ownerName || '',
        serviceName: profile.serviceName || '',
        description: profile.description || '',
        phone: profile.phone || '',
        address: profile.address || '',
        lat: profile.geolocation?.lat || '',
        lng: profile.geolocation?.lng || '',
        category: profile.category?._id || profile.category || '',
        pricing: profile.pricing || '',
        skills: profile.skills?.join(', ') || '',
        experience: profile.experience || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
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
    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'skills') {
        updateData.append(key, formData[key].split(',').map((s) => s.trim()));
      } else if (key === 'lat' || key === 'lng') {
        // Handle geolocation separately
      } else {
        updateData.append(key, formData[key]);
      }
    });

    if (formData.lat && formData.lng) {
      updateData.append(
        'geolocation',
        JSON.stringify({
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        })
      );
    }

    if (profilePhoto) {
      updateData.append('profilePhoto', profilePhoto);
    }

    dispatch(updateProviderProfile(updateData));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
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
            required
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
            required
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
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
            <input
              type="number"
              name="lng"
              step="any"
              value={formData.lng}
              onChange={handleChange}
              placeholder="Longitude"
              required
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing</label>
          <input
            type="text"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            placeholder="e.g., $50/hour"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Plumbing, Electrical, Repair"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., 5 years"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
          />
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

export default ProviderProfile;

