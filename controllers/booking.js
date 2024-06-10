const Listing = require('../models/listing');
const User = require('../models/user');

module.exports.showBookingPage=async(req,res)=>{
    let {id}=req.params
    const listing = await Listing.findById(id);
    res.render('users/book.ejs',{listing})
}

module.exports.addBookingData= async (req, res) => {
    const { id } = req.params;
    const { dateFrom, dateTo, bookingFacilities } = req.body.Listing;
    const listing = await Listing.findById(id);

    const existingBookingIndex = listing.bookings.findIndex(booking => booking.user.equals(req.user._id));

    if (existingBookingIndex > -1) {
        listing.bookings[existingBookingIndex].dateFrom = dateFrom;
        listing.bookings[existingBookingIndex].dateTo = dateTo;
        listing.bookings[existingBookingIndex].bookingFacilities = bookingFacilities;
    } else {
        listing.bookings.push({
            user: req.user._id,
            dateFrom: dateFrom,
            dateTo: dateTo,
            bookingFacilities: bookingFacilities
        });
    }

    await listing.save();
    req.flash('success',' Booking Done !')
    res.redirect(`/listings/${id}`);
};

module.exports.showWatchlist=async(req,res)=>{  

    const listings = await Listing.find({
        $or: [
            { bookings: { $exists: true } },
            { watchlist: { $exists: true } }
        ]
    });
    
    const allListings = listings.filter(listing => {
        return (
            (listing.bookings && listing.bookings.some(booking => booking.user.equals(res.locals.currUser._id))) ||
            (listing.watchlist && listing.watchlist.some(userId => userId.equals(res.locals.currUser._id)))
        );
    });
    
    res.render("listings/index.ejs", { allListings });
    
}

module.exports.addWatchlist=async(req,res)=>{
    let { id } = req.params;
    let userId = req.user._id;
    await Listing.findByIdAndUpdate(id, { $addToSet: { watchlist: userId } });
    req.flash('success',' Watchlist Added  !')
    res.redirect(`/listings/${id}`);
}

module.exports.bookingDrop= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const index = listing.bookings.findIndex(booking => booking.user.equals(req.user._id));
    if (index !== -1) {
        listing.bookings.splice(index, 1);
    }
    await listing.save();
    req.flash('success',' Booking Cancelled !')
    res.redirect('/booking/watch');
};

module.exports.unWatchlist=async(req,res)=>{
    let {id}= req.params;
    let userId = req.user._id;
    await Listing.findByIdAndUpdate(id, { $pull: { watchlist: userId } });
    req.flash('success',' Watchlist Deleted !')
    res.redirect(`/listings/${id}`);
};

module.exports.cart=async(req,res)=>{ 
    let allListings = await Listing.find({ owner: res.locals.currUser._id, bookings: { $exists: true, $ne: [] } });
    res.render("listings/index.ejs",{allListings})  
}

module.exports.userDetail= async (req, res) => {
    const { id } = req.params;  
    const userId = req.query.userId; 

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    let listing = await Listing.findById(id).populate({
        path: 'bookings',
        populate: { path: 'user' }
    });

    if (!listing) {
        return res.status(404).send('Listing not found');
    }

    listing.bookings = listing.bookings.filter(booking => booking.user._id.equals(userId));
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    res.render('users/bookingUser.ejs', { listings: [listing], user });
};

module.exports.customerDetails=async(req,res)=>{
    const { id } = req.params;
        const listing = await Listing.findById(id).populate({
            path: 'bookings',
            populate: { path: 'user' } 
        });
        if (!listing) {
            req.flash('error','Listing you requested for does not exits')
            res.redirect('/listings')
        }
        const listings = [listing];
     res.render('users/customers.ejs',{listings})
}

module.exports.ownerDeleteBooking=async(req,res)=>{
    const { id } = req.params;
    const userId = req.query.userId;
    
    const listing = await Listing.findById(id).populate('bookings');

    if (!listing.owner.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform this action');
        return res.redirect(`/listings/${id}`);
    }

    const bookingIndex = listing.bookings.findIndex(booking => booking.user.equals(userId));

    if (bookingIndex !== -1) {
        listing.bookings.splice(bookingIndex, 1);
        await listing.save();
    }

    req.flash('success', 'Booking Completed successfully');

    res.redirect(`/booking/customerDetails/${id}`);
}
