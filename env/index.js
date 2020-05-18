const {abs, min} = Math;
const {env} = process;
let processCount = env.PROCESS_WORKERS_COUNT || "upto-4";
processCount = abs(parseInt(processCount)) || processCount;
if (processCount && typeof processCount==="string") {
    processCount = processCount.toLowerCase();
    const threads = require("os").cpus()?.length || 1; // added at least one thread because some android phones CPUs are not detected and cpus().length = 0
    if (processCount==="all") processCount = threads;
    else if (processCount.startsWith("upto-")) {
        processCount = abs(parseInt(processCount.replace("upto-", ""))) || 4;
        processCount = min(processCount, threads);
    } else processCount = min(threads, 4);
}

module.exports = Object.freeze({
    
    // DATABASE
    DB_PATH: env.DB_PATH || require("path").resolve(__dirname, "../sample-data/patients_2.json"),

    // API SERVICE
    SERVER_API_PORT: abs(parseInt(env.SERVER_API_PORT)) || 21000,
    DEFAULT_LIMIT: abs(parseInt(env.DEFAULT_LIMIT)) || 10,
    DEFAULT_MAX_LIMIT: abs(parseInt(env.DEFAULT_MAX_LIMIT)) || 1000,
    API_HEADER_NAME: env.API_HEADER_NAME || "X-Luma-Assessment-Version",
    API_HEADER_VALUE: env.API_HEADER_VALUE || "0.0.1",

    // PROCESS
    PROCESS_WORKERS_COUNT: processCount,
    NODE_ENV: env.NODE_ENV,
    NODE_CLUSTER_SCHED_POLICY: env.NODE_CLUSTER_SCHED_POLICY,
    PROD: env.NODE_ENV==="production",
    TRUST_PROXY: env.TRUST_PROXY?.trim()?.toLowerCase() ?? "false" === "true",
    CLUSTER_LOG: env.CLUSTER_LOG?.trim()?.toLowerCase() ?? "false" === "true"
});