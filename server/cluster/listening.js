const {CLUSTER_LOG} = require("../../env");

module.exports = (worker, address)=>{
    if (CLUSTER_LOG) console.info(`worker ${worker.id} (${worker.process.pid}) is listening on ${address.port}`);
};