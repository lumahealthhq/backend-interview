const {CLUSTER_LOG} = require("../../env");

module.exports = worker=>{
    if (CLUSTER_LOG) console.info(`worker ${worker.id} (${worker.process.pid}) forked`);
};