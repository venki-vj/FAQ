const User=require('../models/user');

module.exports.get=(req,res)=>{
    res.render('user/register')
}
module.exports.register=async(req,res)=>{
    try{
     const {email,username,password}=req.body;
     const user=new User({email,username});
     const registerUser=await User.register(user,password);
     req.login(registerUser,err=>{
         if(err) return next(err);
         req.flash('success',"Successfully registered to FAQ");
         res.redirect('/login')
     })}catch(e){
         req.flash('error',e.message);
         res.redirect('register')
    }
 }
module.exports.getLogin=(req,res)=>{
   
    res.render('user/login')
}
    
module.exports.postLogin=(req,res)=>{
    req.flash('success',"Successfully Logged-in");
    const redirectUrl=req.session.returnTo || '/campgrounds';
  
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}
module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success',"GoodBye");
    res.redirect('login')
}