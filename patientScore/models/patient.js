const mongoose = require('mongoose');



const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
           
        },
        id: { 
            type: String,
            trim: true,
            required: true,
            unique:true
          
        },
        location: { 
            type: Object
           
        },
        age: { 
            type: Number,
            required: true

        },
        acceptedOffers: { 
            type: Number,
            required: true

        },
        canceledOffers: { 
            type: Number,
            required: true

        },
        averageReplyTime: { 
            type: Number,
            required: true

        }
    }
     
);


module.exports = mongoose.model('Patient', patientSchema);
