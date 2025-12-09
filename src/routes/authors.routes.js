import express from 'express';
import { Author } from '../models/author.model.js';
import { buildPagination, buildSort } from '../utils/queryOptions.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { skip, limit, page } = buildPagination(req);
    const sort = buildSort(req.query.sort);
    const q = req.query.q;
    const filter = {};
    if (q) {
      filter.name = new RegExp(q, 'i');
    }
    const [items, total] = await Promise.all([
      Author.find(filter).sort(sort).skip(skip).limit(limit),
      Author.countDocuments(filter)
    ]);
    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Not found' });
    res.json(author);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!author) return res.status(404).json({ message: 'Not found' });
    res.json(author);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;