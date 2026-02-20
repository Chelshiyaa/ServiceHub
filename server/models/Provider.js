import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const providerSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: [true, 'Please provide owner name'],
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    geolocation: {
      lat: {
        type: Number,
        required: [true, 'Please provide latitude'],
      },
      lng: {
        type: Number,
        required: [true, 'Please provide longitude'],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    pricing: {
      type: String,
      trim: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      schedule: {
        type: Map,
        of: {
          start: String,
          end: String,
          isAvailable: Boolean,
        },
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
    serviceImages: [
      {
        url: String,
        public_id: String,
      },
    ],
    profilePhoto: {
      url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['user', 'provider', 'admin'],
      default: 'provider',
    },
    skills: [String],
    experience: {
      type: String,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
providerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
providerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Provider = mongoose.model('Provider', providerSchema);

export default Provider;

