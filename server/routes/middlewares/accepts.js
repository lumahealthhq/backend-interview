module.exports = (req, res, next)=>{
    if (!req.accepts("json")) return res.status(406).send({error: "Not acceptable"});
    return next();
};