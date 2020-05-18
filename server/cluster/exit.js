const Cluster = require("cluster");

module.exports = (worker, code, signal)=>{
    console.warn(`process ${worker.process.pid} died (${signal || code})`);
    worker.disconnect();
    Cluster.fork();
};