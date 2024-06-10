const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync= require('../utils/wrapAsyc')
const {validateReview,isLoggedIn,isReviewAuthor}= require('../middleware')
const reviewController = require('../controllers/reviews')


router.get('/:reviewId',(req,res)=>{    
    let {id} = req.params
    res.redirect(`/listings/${id}`)
})

router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;