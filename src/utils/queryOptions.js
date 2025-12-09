export function buildPagination(req) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;
  return { limit, page, skip };
}

export function buildSort(sortParam) {
  if (!sortParam) return { createdAt: -1 };
  const fields = sortParam.split(',');
  const sort = {};
  fields.forEach(f => {
    const [field, dir = 'asc'] = f.split(':');
    sort[field] = dir === 'desc' ? -1 : 1;
  });
  return sort;
}