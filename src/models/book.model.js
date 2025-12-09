import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 4000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true
    },
    genres: {
      type: [String],
      validate: {
        validator: arr => Array.isArray(arr) && arr.length > 0,
        message: 'At least one genre is required'
      }
    },
    publishedYear: {
      type: Number,
      min: 1500,
      max: new Date().getFullYear()
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    ratingCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', description: 'text' });
bookSchema.index({ author: 1, publishedYear: -1 });
bookSchema.index({ avgRating: -1 });

export const Book = mongoose.model('Book', bookSchema);