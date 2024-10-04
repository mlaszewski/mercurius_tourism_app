import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    hash: {
      type: String,
      select: false
    },
    salt: {
      type: String,
      select: false
    },
    isGuide: {
      type: Boolean,
      required: true,
      default: false
    },
    profile: {
      name: String,
      bio: String,
      languages: [String],
      birthDate: String,
      contact: {
        phone: String,
        email: String
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
