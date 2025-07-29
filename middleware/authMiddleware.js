//Ensure user is authenticated
exports.ensureAuthenticated=(req,res,next)=>{
    if(req.session.user){
        return next();
    }
    res.redirect("/login")
}

//Ensure user is a manager
exports.ensureManager=(req,res,next)=>{
    if(req.session.user && req.session.user.role==='brooderManager'){
        return next();
    }
    res.redirect("/")
}

//Ensure user is a Sales rep
exports.ensureSalesRep=(req,res,next)=>{
    if(req.session.user && req.session.user.role==='salesRep'){
        return next();
    }
    res.redirect("/")
}

//Ensure user is a Farmer
exports.ensureFarmer=(req,res,next)=>{
    if(req.session.user && req.session.user.role==='farmer'){
        return next();
    }
    res.redirect("/")
}