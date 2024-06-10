const Listing = require('../models/listing');

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings})
 };

 module.exports.renderNewFrom=(req,res)=>{
     res.render('listings/new.ejs')
 };

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:'reviews',populate:{path:'author'}})
   .populate('owner')
    if(!listing){
       req.flash('error','Listing you requested for does not exits')
       res.redirect('/listings')
    }
    res.render('listings/show.ejs',{listing})
};

module.exports.createListing=async (req,res,next)=>{
    let url =req.file.path;
    let filename = req.file.filename
    const newListing = new Listing( req.body.Listing);
    newListing.owner=req.user._id
    newListing.image={url,filename}
    await newListing.save()
    req.flash('success','New Listing Created !')
    res.redirect('/listings')
    
};

module.exports.renderEditForm=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash('error','Listing you requested for does not exits')
        res.redirect('/listings')
     }

   let originalIamgeUrl =  listing.image.url;
   originalIamgeUrl= originalIamgeUrl.replace('/upload','/upload/w_250')
    res.render('listings/edit.ejs',{listing,originalIamgeUrl})
};

module.exports.updateListing=async(req,res)=>{
    let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !=="undefined"){
        let url =req.file.path;
        let filename = req.file.filename
        listing.image={url,filename}
        await listing.save();
    }
   
    req.flash('success',' Listing Updated !')
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success',' Listing Deleted !')
     res.redirect('/listings')

};


module.exports.searchListing=async (req, res) => {
    let { country } = req.body;

    res.redirect(`/listings/results?country=${encodeURIComponent(country)}`);
};

module.exports.searchResult=async(req,res)=>{
    let {country}= req.query;
    const allListings = await Listing.find({
        "$or":[
            {"country":{$regex:country}},
            {"location":{$regex:country}},
        ]
    });
     res.render("listings/index.ejs",{allListings})
};

module.exports.specialOptions=async(req,res)=>{
    let {option} =req.params
    const allListings = await Listing.find({option:option})
    res.render("listings/index.ejs",{allListings})
}


module.exports.UserOption=async(req,res)=>{
    let {user}= req.params
    const allListings = await Listing.find({owner:user});
     res.render("listings/index.ejs",{allListings})
}