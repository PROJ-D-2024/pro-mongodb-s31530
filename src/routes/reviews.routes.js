import express from 'express';
import { Review } from '../models/review.model.js';
import { buildPagination, buildSort } from '../utils/queryOptions.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { skip, limit, page } = buildPagination(req);
    const sort = buildSort(req.query.sort);
    const { bookId, userId, minRating } = req.query;

    const filter = {};
    if (bookId) filter.book = bookId;
    if (userId) filter.user = userId;
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate('book')
        .populate('user')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter)
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('book')
      .populate('user');
    if (!review) return res.status(404).json({ message: 'Not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: 'Not found' });
    await Review.recalculateBookRating(review.book);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id });
    if (!review) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;