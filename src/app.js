import express from 'express';
import morgan from 'morgan';
import usersRouter from './routes/users.routes.js';
import authorsRouter from './routes/authors.routes.js';
import booksRouter from './routes/books.routes.js';
import reviewsRouter from './routes/reviews.routes.js';
import analyticsRouter from './routes/analytics.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', usersRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);
app.use('/reviews', reviewsRouter);
app.use('/analytics', analyticsRouter);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
});

export default app;