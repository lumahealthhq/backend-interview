const {DEFAULT_LIMIT, DEFAULT_MAX_LIMIT} = require("../../../env");
const {abs, min} = Math;
const sortDirectionOptions = ["ASC", "DESC"];

const treatInt = number=>abs(parseInt(number));

module.exports = (req, res, next)=>{
    if (req.method!=="GET") return next();
    let {query: {limit=DEFAULT_LIMIT, offset, sortDirection="ASC", page}} = req;
    
    [limit, offset, sortDirection, page] = [treatInt(limit), treatInt(offset), sortDirection.toUpperCase(), treatInt(page)];
    if (!isNaN(page) && page<1) return res.status(400).send({error: "Invalid 'page' in query string"});
    if (!offset && page) offset = limit*(page-1);
    if (!offset && !page) offset = 0;
    if (isNaN(limit)) return res.status(400).send({error: "Invalid 'limit' in query string"});
    if (isNaN(offset)) return res.status(400).send({error: "Invalid 'offset' in query string"});
    if (!sortDirectionOptions.includes(sortDirection))
        return res.status(400).send({error: "Invalid 'sortDirection' in query string"});
    limit = min(limit, DEFAULT_MAX_LIMIT);
    req.query = {...req.query, limit, offset, sortDirection};
    return next();
};