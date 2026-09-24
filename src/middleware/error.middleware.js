function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    error: error.message || "Server error",
    details: error.details || undefined,
  });
}

export { notFound, errorHandler };
