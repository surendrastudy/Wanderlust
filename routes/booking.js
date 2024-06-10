const express = require('express');
const router = express.Router();
const wrapAsync= require('../utils/wrapAsyc')
const {isLoggedIn}= require('../middleware.js');
const bookingController =require('../controllers/booking.js')


router.route('/:id/book')
router.get('/:id/book',isLoggedIn,wrapAsync(bookingController.showBookingPage));
router.put('/:id/book',isLoggedIn,wrapAsync(bookingController.addBookingData));

router.get('/watch',isLoggedIn,wrapAsync(bookingController.showWatchlist)); 
router.get('/watchlist/:id',isLoggedIn,wrapAsync(bookingController.addWatchlist));
router.get('/:id/drop',isLoggedIn,wrapAsync(bookingController.bookingDrop));
router.delete('/watchlist/:id/unWatchlist',isLoggedIn,wrapAsync(bookingController.unWatchlist));
router.get('/cart',isLoggedIn,wrapAsync(bookingController.cart));
router.get('/userdetails/:id',isLoggedIn,wrapAsync(bookingController.userDetail));
router.get('/customerDetails/:id',isLoggedIn,wrapAsync(bookingController.customerDetails));
router.get('/:id/ownercancel',isLoggedIn,wrapAsync(bookingController.ownerDeleteBooking))
module.exports = router;
