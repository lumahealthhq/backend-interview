
var users = [];

users.push({ id: 11, name: 'Mathew Halvorson'});
users.push({ id: 12, name: 'Mossie Larkin'});
users.push({ id: 13, name: 'Shad Mills'});

/**
 * Load user and append to req.
 */
exports.load = function(req, res, next, id) {
  req.user = users.find(u => u.id == id);
  return next();
}

exports.create = function(req, res) {
  const user = { id: req.body.id, name: req.body.name };
  users.push(user);
  res.status(200).json(user);
}

exports.update = function(req, res) {
  req.user.name = req.body.name;
  res.status(200).json(req.user);
}

exports.remove = function(req, res) {
  users = users.filter(u => u !== req.user);
  res.status(200).json(req.user);  
}

/**
 * Get user
 * @returns {User}
 */
exports.get = function(req, res) {
  res.status(200).json(req.user);
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
exports.list = function(req, res) {
  res.status(200).json(users);
}
