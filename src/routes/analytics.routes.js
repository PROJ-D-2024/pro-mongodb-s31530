import express from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/review.model.js';

const router = express.Router();

router.get('/top-books', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const days = parseInt(req.query.days, 10) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$book',
          avgRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      { $unwind: '$book' },
      { $sort: { avgRating: -1, ratingCount: -1 } },
      { $limit: limit }
    ];

    const results = await Review.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/top-authors', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const minBooks = parseInt(req.query.minBooks, 10) || 1;

    const pipeline = [
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book'
        }
      },
      { $unwind: '$book' },
      {
        $group: {
          _id: '$book.author',
          avgRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
          bookCount: { $addToSet: '$book._id' }
        }
      },
      {
        $addFields: {
          bookCount: { $size: '$bookCount' }
        }
      },
      { $match: { bookCount: { $gte: minBooks } } },
      {
        $lookup: {
          from: 'authors',
          localField: '_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      { $sort: { avgRating: -1, ratingCount: -1 } },
      { $limit: limit }
    ];

    const results = await Review.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/active-users', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$user',
          reviewCount: { $sum: 1 },
          lastReviewAt: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { reviewCount: -1 } },
      { $limit: limit }
    ];

    const results = await Review.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;