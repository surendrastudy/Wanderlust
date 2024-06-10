const mongoose = require('mongoose');
const Review = require('./review');
const bookingSchema = require('./booking');


const listingSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{

        url:String,
        filename:String,
        
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },

    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review',
        }
    ],

    owner:{
        type:mongoose.Schema.Types.ObjectId,
            ref:'User',
    },
    
    option:{
        type:String
    },
 
    bookings: [bookingSchema],

    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
});

listingSchema.post('findOneAndDelete',async(Listing)=>{
    if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;