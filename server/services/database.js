const {promises: {readFile}} = require("fs");
const {DB_PATH, DEFAULT_LIMIT} = require("../../env");
const {hypot, max, min, random} = Math;

const WEIGHTS = {
    age: 1,
    distance: 1,
    acceptedOffers: 3,
    canceledOffers: 3,
    averageReplyTime: 2
};

const sort = (value, a, b)=>{
    // if scores from both are not equal (score!==0)
    if (value) return value;
    if (a.name!==b.name) return a.name<b.name && -1 || 1; // sort by name
    return a.id<b.id && -1 || 1; // sort by ID in last case
};

const query = exports.query = async(sort="name", direction="ASC", limit=DEFAULT_LIMIT, offset=0)=>{
    direction = direction.toUpperCase();
    const patients = JSON.parse(await readFile(DB_PATH, "utf8"));
    patients.forEach((patient, index)=>{
        [patient.lat, patient.lng] = [Number(patient.location.latitude), Number(patient.location.longitude)];
        delete patient.location;
        
        patients[index] = patient;
    });
    if (sort!=null) patients.sort((a, b)=>{
        let value;
        if (typeof a[sort]==="number") value = direction==="ASC" ? a[sort]-b[sort] : b[sort]-a[sort];
        else value = direction==="ASC" ? a[sort]<b[sort] && -1 || 1 : a[sort]<b[sort] && 1 || -1;
        return value || a.id<b.id && -1 || 1;
    });
    return patients.splice(offset, limit);
};

exports.sortByScore = async(lat, lng, direction="DESC", limit=DEFAULT_LIMIT, offset=0)=>{
    if (lat==null || lng==null) throw Error("Lat and Lng must not be null");
    direction = direction.toUpperCase();
    
    const patients = await query();
    patients.forEach(patient=>patient.distance = hypot(lat-patient.lat, lng-patient.lng));
    
    // generate score
    const {
        maxAccepted, maxAge, maxCanceled, maxDistance, maxReplyTime,
        minAccepted, minAge, minCanceled, minDistance, minReplyTime
    } = patients.reduce((obj, patient)=>{
        obj.maxAccepted = max(patient.acceptedOffers, obj.maxAccepted);
        obj.maxCanceled = max(patient.canceledOffers, obj.maxCanceled);
        obj.maxReplyTime = max(patient.averageReplyTime, obj.maxReplyTime);
        obj.maxAge = max(patient.age, obj.maxAge);
        obj.maxDistance = max(patient.distance, obj.maxDistance);
        obj.minAccepted = min(patient.acceptedOffers, obj.minAccepted);
        obj.minCanceled = min(patient.canceledOffers, obj.minCanceled);
        obj.minReplyTime = min(patient.averageReplyTime, obj.minReplyTime);
        obj.minAge = min(patient.age, obj.minAge);
        obj.minDistance = min(patient.distance, obj.minDistance);
        return obj;
    }, {maxAccepted: 0, maxAge: 0, maxCanceled: 0, maxDistance: 0, maxReplyTime: 0, minAccepted: Infinity, minAge: Infinity, minCanceled: Infinity, minDistance: Infinity, minReplyTime: Infinity});
    
    const acceptedOffers = maxAccepted-minAccepted;
    const age = maxAge-minAge;
    const averageReplyTime = maxReplyTime-minReplyTime;
    const canceledOffers = maxCanceled-minCanceled;
    const distance = maxDistance-minDistance;
    patients.forEach(patient=>{
        const rawScore = {
            acceptedOffers: (patient.acceptedOffers-minAccepted)/acceptedOffers,
            age: (patient.age-minAge)/age,
            averageReplyTime: 1-(patient.averageReplyTime-minReplyTime)/averageReplyTime,
            canceledOffers: 1-(patient.canceledOffers-minCanceled)/canceledOffers,
            distance: 1-(patient.distance-minDistance)/distance
        };
        patient.score = Object.keys(WEIGHTS).reduce((score, key)=>score+rawScore[key]*WEIGHTS[key], 0); // apply the weights
    });
    patients.sort((a, b)=>sort(direction==="ASC" ? a.score-b.score : b.score-a.score, a, b));
    
    // 30% change (pseudorandom) of the lowest tracked behavior get to the top of the list
    if (random()<.3) {
        let lowestIndex, lowest;
        for (const i in patients) {
            const patient = patients[i];
            if (!lowest || lowest.acceptedOffers+lowest.canceledOffers>patient.acceptedOffers+patient.canceledOffers) {
                lowest = patient;
                lowestIndex = i;
            }
        }
        patients.unshift(...patients.splice(lowestIndex, 1));
    }
    return patients.splice(offset, limit);
};

exports.sortByDistance = async(lat, lng, direction="ASC", limit=DEFAULT_LIMIT, offset=0)=>{
    if (lat==null || lng==null) throw Error("Lat and Lng must not be null");
    direction = direction.toUpperCase();
    
    const patients = await query();
    
    patients.forEach(patient=>patient.distance = hypot(lat-patient.lat, lng-patient.lng));
    patients.sort((a, b)=>sort(direction==="ASC" ? a.distance-b.distance : b.distance-a.distance, a, b));
    return patients.splice(offset, limit);
};