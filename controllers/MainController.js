const MainModel = require( '../models/MainModel')

module.exports = {
    async root(req, res, next){         
        //check if body exist
        let {lat, lon} = req.body
        if (lat == null || lon == null || lat.length < 3 || lon.length < 3) {
            res.status(401).send({ status: 'Valid body is missing', exemple: {"lat": 46.70, "lon":-62.100}})
            return
        }

        await MainModel.root(req, res, next)                 
    },

}