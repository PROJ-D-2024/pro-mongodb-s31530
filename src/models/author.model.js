import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 2000
    },
    website: {
      type: String,
      validate: {
        validator: v => !v || /^https?:\/\/.+/.test(v),
        message: 'Website must be a valid URL'
      }
    }
  },
  { timestamps: true }
);

authorSchema.index({ name: 1 });

export const Author = mongoose.model('Author', authorSchema);