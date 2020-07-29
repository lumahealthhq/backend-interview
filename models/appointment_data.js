const mongoose = require('mongoose');



const appotinmentDataSchema = new mongoose.Schema(
    {
        
         maxAge: {
            type: Number,
            trim: true,
            required: true
           
        },
        maxAcceptedOffers: {
            type: Number,
            trim: true,
            required: true
           
        },
        maxCanceledOffers: {
            type: Number,
            trim: true,
            required: true
           
        },
        maxAverageReplyTime: {
            type: Number,
            trim: true,
            required: true
           
        },

    }
     
);


module.exports = mongoose.model('AppotinmentData', appotinmentDataSchema);
