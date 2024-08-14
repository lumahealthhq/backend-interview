module.exports.contentType = (_, res, next) => {
  res.type("json");
  next();
};
