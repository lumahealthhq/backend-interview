// worker/slave thread of the server that access the database

const Express = require("express");
const {SERVER_API_PORT, PROD, TRUST_PROXY, MAX_REQUEST_BODY_SIZE} = require("../env");
const app = Express();

app.use(Express.json({limit: MAX_REQUEST_BODY_SIZE}));
app.use(Express.urlencoded({extended: false, limit: MAX_REQUEST_BODY_SIZE}));
app.use(require("compression")());
app.use(require("helmet")());
app.use(require("frameguard")({action: "deny"}));
app.use(require("referrer-policy")({policy: "same-origin"}));

if (TRUST_PROXY) app.enable("trust proxy");
if (!PROD) app.set("json spaces", "\t");
app.set("json replacer", (key, value)=>typeof value==="bigint" && value.toString() || value);
app.set("etag", "strong");
app.use(require("./routes"));

module.exports = app.listen(SERVER_API_PORT, ()=>console.info(`Server open on port ${SERVER_API_PORT}`));