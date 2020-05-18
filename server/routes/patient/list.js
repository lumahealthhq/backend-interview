const Database = require("../../services/database");

module.exports = async(req, res, next)=>{
    const {query: {limit, offset, sort, sortDirection, lat, lng}} = req;
    try {
        let data;
        if (sort==="score") data = await Database.sortByScore(lat, lng, sortDirection, limit, offset);
        else if (sort==="distance") data = await Database.sortByDistance(lat, lng, sortDirection, limit, offset);
        else data = await Database.query(sort, sortDirection, limit, offset);
        return res.send(data);
    } catch(e) {
        return next(e);
    }
};