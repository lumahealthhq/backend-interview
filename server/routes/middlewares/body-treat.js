/* this middleware will enter in all object properties and trim all string values
   * this system is projected to receive plain request bodies (plain strict JSON or plain URL-Encoded)
   so all values are numbers, strings or booleans. **(except in file uploads)** */

const {entries} = Object;

module.exports = (req, res, next)=>{
    if (!req.is("urlencoded") && !req.is("json") || !req.body) return next();
    const {body} = req;
    for (const [key, value] of entries(body)) if (typeof value==="string") body[key] = value.trim().replace(/\s{2,}/g, " ");
    return next();
};