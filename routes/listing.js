const express = require('express');
const router = express.Router();
const wrapAsync= require('../utils/wrapAsyc')
const {isLoggedIn,isOwner,validateListing}= require('../middleware.js');
const listingController =require('../controllers/listings.js')
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage }) 


router.post('/search',wrapAsync(listingController.searchListing))
router.get('/results',wrapAsync(listingController.searchResult))

router.get('/special/:option',wrapAsync(listingController.specialOptions))

router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('Listing[image]'),wrapAsync(listingController.createListing));

router.get('/new',isLoggedIn,listingController.renderNewFrom); 

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('Listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
 
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
router.get('/:user/UserListing',isLoggedIn,wrapAsync(listingController.UserOption))
module.exports = router;