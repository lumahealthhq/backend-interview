const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  id: String,
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  location:{
    latitude: String,
    longitude: String
  },
  acceptedOffers: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  canceledOffers: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  averageReplyTime: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
});

module.exports = Patient = mongoose.model('patients', PatientSchema);