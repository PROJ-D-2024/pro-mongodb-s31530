import express from 'express';
import { Book } from '../models/book.model.js';
import { buildPagination, buildSort } from '../utils/queryOptions.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { skip, limit, page } = buildPagination(req);
    const sort = buildSort(req.query.sort);
    const { q, authorId, genre, minRating } = req.query;

    const filter = {};
    if (authorId) filter.author = authorId;
    if (genre) filter.genres = genre;
    if (minRating) filter.avgRating = { $gte: Number(minRating) };

    if (q) {
      filter.$text = { $search: q };
    }

    const query = Book.find(filter)
      .populate('author')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const [items, total] = await Promise.all([
      query,
      Book.countDocuments(filter)
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) return res.status(404).json({ message: 'Not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author');
    if (!book) return res.status(404).json({ message: 'Not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;