import { getDistance } from './geo';
import { assign, map, pick, reduce } from 'lodash/fp';

const WEIGHTS = {
  age: 0.10,
  distance: 0.10,
  acceptedOffers: 0.30,
  canceledOffers: 0.30,
  averageReplyTime: 0.20
};

// All based on your script, for now
const MAXIMUM_DISTANCE = 50000;
const MAXIMUM_REPLY_TIME = 3600;
const MAXIMUM_OFFERS = 100;
const INACTIVITY_OFFERS_AMOUNT = 5;
const INACTIVITY_REPLY_TIME = 1;

export const calculateScore = (location, patient) => {
  // We use a third party library to work this distance out, in meters
  const data = assign({ distance: getDistance(location,
     patient.location)
  })(patient);
  
  // This is where we determine when to reward a patient based on inactivity.
  // I'm a little iffy about including reply time.
  const hasLittleBehaviourData = (data['acceptedOffers'] < INACTIVITY_OFFERS_AMOUNT &&
    data['canceledOffers'] < INACTIVITY_OFFERS_AMOUNT) ||
    data['averageReplyTime'] < INACTIVITY_REPLY_TIME;

  const scores = map.convert({cap: false})((value, key) => {
    switch (key) {
      case 'acceptedOffers': {
        let divisor = MAXIMUM_OFFERS;
        if (hasLittleBehaviourData) {
          divisor = INACTIVITY_OFFERS_AMOUNT;
        }
        return ((parseFloat(value) / divisor) / 0.10) * WEIGHTS[key];
      }
      // By default, we decrease a user's score by how many cancelled offers they've had.
      // If they have little behaviour data, then we just return 0. 
      case 'canceledOffers': {
        if (hasLittleBehaviourData) {
          return 0;
        }
        return -((parseFloat(value) / MAXIMUM_OFFERS) / 0.10) * WEIGHTS[key];
      }
      default:
        // Standard percentage calculation, going by each fields' weight (seen above)
        return ((parseFloat(value) / MAXIMUM_OFFERS) / 0.10) * WEIGHTS[key];
    }
  })(pick(['age', 'acceptedOffers', 'canceledOffers'])(data));

  scores.push(calculateDistanceScore(data.distance));
  scores.push(calculateAverageReplyTimeScore(data.averageReplyTime));
  
  const result = reduce((result, value, key) => {
    return result + value;
  })(0)(scores);
  return result.toFixed(0);
}

const calculateDistanceScore = (distance) => {
  // This was a challenging problem. I thought to create a 'ceiling' of sorts based on
  // a 'maximum distance' in order to work out an accurate score. After all, I'm not sure why
  // a hospital would consider someone likely to accept an offer if they're not within 50000 
  // meters of the place (that's roughly the size of San Francisco county).
  // This may be an oversight on my behalf of how the medical system works over here, so apologies
  // in that regard.
  // We're also minusing by 10 as a way to prioritise patients closer to the clinic, and reward them accordingly.
  if (distance > MAXIMUM_DISTANCE) {
    return 0;
  }
  return (10-(distance / MAXIMUM_DISTANCE) / 0.10) * WEIGHTS['distance'];
}

const calculateAverageReplyTimeScore = (time) => {
  // This was another challenging problem. How do we capture inactivity with response
  // times? I thought that a very small response window would indicate inactivity, and that's how we
  // could reward new customers. 
  // We're also minusing by 10 to see how quick they response, and give a better score based on that.
  if (time > MAXIMUM_REPLY_TIME) {
    return 0;
  }
  if (time < INACTIVITY_REPLY_TIME) {
    return (10-(time / INACTIVITY_REPLY_TIME) / 0.10) * WEIGHTS['averageReplyTime'];
  }
  return (10-(time / MAXIMUM_REPLY_TIME) / 0.10) * WEIGHTS['averageReplyTime'];
}
