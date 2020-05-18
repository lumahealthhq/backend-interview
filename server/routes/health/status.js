const Cluster = require("cluster");
const OS = require("os");
const Bytes = require("bytes");
const {
    DEFAULT_LIMIT, DEFAULT_MAX_LIMIT,
    API_HEADER_NAME, API_HEADER_VALUE,
    MAX_REQUEST_BODY_SIZE, PROCESS_WORKERS_COUNT
} = require("../../../env");

const {entries} = Object;
const {floor, round} = Math;

const listFormat = new Intl.ListFormat("en-GB", {type: "conjunction", style: "long"});

function parseTime(seconds) {
    seconds = round(Number(seconds));
    const days = floor(seconds/(3600*24));
    seconds -= days*(3600*24);
    const hours = floor(seconds/3600);
    seconds -= hours*3600;
    const minutes = floor(seconds/60);
    seconds -= minutes*60;
    
    const prettyDays = days>0?days+(days===1?" day":" days"):"";
    const prettyHours = hours>0?hours+(hours===1?" hour":" hours"):"";
    const prettyMinutes = minutes>0?minutes+(minutes===1?" minute":" minutes"):"";
    const prettySeconds = seconds>0?seconds+(seconds===1?" second":" seconds"):"";
    return listFormat.format([prettyDays, prettyHours, prettyMinutes, prettySeconds].filter(a=>a));
}

module.exports = (req, res)=>res.send({
    worker: Cluster?.id,
    status: "OK",
    operatingSystem: {
        arch: OS.arch(),
        cpus: OS.cpus().length,
        freeMemory: Bytes(OS.freemem()),
        platform: OS.platform(),
        release: OS.release(),
        totalMemory: Bytes(OS.totalmem()),
        type: OS.type(),
        upSince: new Date(Date.now()-OS.uptime()*1000),
        uptime: parseTime(OS.uptime())
    },
    process: {
        arch: process.arch,
        memoryUsage: entries(process.memoryUsage()).reduce((memory, [key, value])=>({...memory, [key]: Bytes(value)}), {}),
        platform: process.platform,
        upSince: new Date(Date.now()-process.uptime()*1000),
        uptime: parseTime(process.uptime()),
        version: process.version
    },
    application: {
        defaultLimit: DEFAULT_LIMIT,
        defaultMaxLimit: DEFAULT_MAX_LIMIT,
        maxRequestBodySize: MAX_REQUEST_BODY_SIZE,
        httpHeader: API_HEADER_NAME,
        version: API_HEADER_VALUE,
        workers: PROCESS_WORKERS_COUNT
    }
});