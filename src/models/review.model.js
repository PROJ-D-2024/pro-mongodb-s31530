import mongoose from 'mongoose';
import { Book } from './book.model.js';

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

// Recalculate book rating after review changes
reviewSchema.statics.recalculateBookRating = async function (bookId) {
  const result = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        avgRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      avgRating: result[0].avgRating,
      ratingCount: result[0].ratingCount
    });
  } else {
    await Book.findByIdAndUpdate(bookId, { avgRating: 0, ratingCount: 0 });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.recalculateBookRating(this.book);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.recalculateBookRating(doc.book);
  }
});

reviewSchema.index({ book: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);