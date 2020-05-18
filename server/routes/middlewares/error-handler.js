// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next)=>{
    console.warn(`Error happened on ${req.originalUrl}`, "params", req.params, "query", req.query);
    console.warn(error);
    if (!res.statusCode || res.statusCode===200) res.status(500);
    return res.send(typeof error==="object" && error || {error});
};