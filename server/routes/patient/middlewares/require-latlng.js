module.exports = (req, res, next)=>{
    const {query} = req;
    if (query.sort!=="distance" && query.sort!=="score") return next();
    const [lat, lng] = [Number(query.lat), Number(query.lng)];
    if (isNaN(lat)) return res.status(400).send({error: "Parameter 'lat' is required in querystring"});
    if (isNaN(lng)) return res.status(400).send({error: "Parameter 'lng' is required in querystring"});
    req.query = {...req.query, lat, lng};
    return next();
};