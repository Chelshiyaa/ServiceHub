import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { calculateDistance } from '../utils/calculateDistance.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      geolocation: req.body.geolocation,
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search services
// @route   GET /api/user/search
// @access  Private
export const searchServices = async (req, res, next) => {
  try {
    const { service, lat, lng, radius = 50, category, minRating } = req.query;

    let query = { status: 'approved' };

    if (category) {
      query.category = category;
    }

    if (service) {
      query.$or = [
        { serviceName: { $regex: service, $options: 'i' } },
        { description: { $regex: service, $options: 'i' } },
        { skills: { $in: [new RegExp(service, 'i')] } },
      ];
    }

    if (minRating) {
      query['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    let providers = await Provider.find(query)
      .populate('category')
      .select('-password');

    // Filter by distance if lat and lng provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      providers = providers.filter((provider) => {
        if (!provider.geolocation.lat || !provider.geolocation.lng) {
          return false;
        }
        const distance = calculateDistance(
          userLat,
          userLng,
          provider.geolocation.lat,
          provider.geolocation.lng
        );
        provider.distance = distance;
        return distance <= radiusKm;
      });

      // Sort by distance
      providers.sort((a, b) => a.distance - b.distance);
    }

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Remove favorite provider
// @route   POST /api/user/favorites/:id
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const providerId = req.params.id;

    const isFavorite = user.favorites.includes(providerId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== providerId
      );
    } else {
      user.favorites.push(providerId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

