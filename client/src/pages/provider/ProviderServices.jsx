import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProviderProfile, addServiceImages } from '../../redux/slices/providerSlice';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const ProviderServices = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.provider);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(getProviderProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setImages(profile.serviceImages || []);
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    dispatch(addServiceImages(formData)).then(() => {
      dispatch(getProviderProfile());
    });
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axiosInstance.delete(`/provider/services/images/${imageId}`);
      toast.success('Image deleted successfully');
      dispatch(getProviderProfile());
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Service Images</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          You can upload multiple images at once (max 10)
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Service Images ({images.length})</h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Service ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(image._id || index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;

