export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const details = error.errors?.map((entry) => ({ path: entry.path, message: entry.message })) || [{ message: error.message }];
      res.status(400).json({ error: 'Validation failed', details });
    }
  };
}
