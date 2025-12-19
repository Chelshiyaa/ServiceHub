import Provider from '../models/Provider.js';
import cloudinary, { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get provider details (public)
// @route   GET /api/provider/:id
// @access  Public
export const getProviderPublic = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('category');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    // Only show approved providers to public
    if (provider.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider profile
// @route   GET /api/provider/profile
// @access  Private
export const getProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user._id).populate('category');

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider profile
// @route   PUT /api/provider/profile
// @access  Private
export const updateProviderProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      ownerName: req.body.ownerName,
      serviceName: req.body.serviceName,
      description: req.body.description,
      phone: req.body.phone,
      address: req.body.address,
      category: req.body.category,
      pricing: req.body.pricing,
      skills: req.body.skills,
      experience: req.body.experience,
      availability: req.body.availability,
    };

    // Handle geolocation (can be JSON string or object)
    if (req.body.geolocation) {
      fieldsToUpdate.geolocation =
        typeof req.body.geolocation === 'string'
          ? JSON.parse(req.body.geolocation)
          : req.body.geolocation;
    }

    // Handle profile photo upload
    if (req.file) {
      if (req.user.profilePhoto?.public_id) {
        await cloudinary.uploader.destroy(req.user.profilePhoto.public_id);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'servicehub');
      fieldsToUpdate.profilePhoto = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const provider = await Provider.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    ).populate('category');

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add service images
// @route   POST /api/provider/services/images
// @access  Private
export const addServiceImages = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user._id);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded (field name must be "images")',
      });
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => 
        uploadToCloudinary(file.buffer, 'servicehub')
      );
      const results = await Promise.all(uploadPromises);
      
      const images = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));

      provider.serviceImages = [...provider.serviceImages, ...images];
      await provider.save();
    }

    res.status(200).json({
      success: true,
      data: provider.serviceImages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service image
// @route   DELETE /api/provider/services/images/:id
// @access  Private
export const deleteServiceImage = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user._id);
    const imageId = req.params.id;

    const image = provider.serviceImages.id(imageId);
    if (image && image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    provider.serviceImages = provider.serviceImages.filter(
      (img) => img._id.toString() !== imageId
    );
    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/provider/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const provider = await Provider.findById(req.user._id).select('+password');

    if (!(await provider.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    provider.password = newPassword;
    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

