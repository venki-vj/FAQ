if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const session =require('express-session');
const flash=require('connect-flash');
const ExpressError =require('./utils/ExpressErrors');
const methodOverride=require('method-override');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user')
const helmet=require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes=require('./routes/user')
const campgroundRoutes =require('./routes/campgrounds');
const reviewRoutes =require('./routes/reviews');


const MongoDBStore = require("connect-mongo")(session);
// process.env.DB_URL||
const dbUrl = process.env.DB_URL|| 'mongodb://localhost:27017/FAQ';

mongoose.connect(dbUrl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});



const db=mongoose.connection;
db.on('error',console.error.bind(console,'Connection error:'));
db.once('open',()=>{
    console.log('Database Connected')
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({replaceWith: '_'}));

 
const secret =process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
 const sessionConfig = {
        store,
        name: 'session',
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
}
  
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());



const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dz6venkiqj3/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error')
    next();
})

app.use('/',userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)



app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/userProfile',(req,res)=>{
    res.render('uProfile')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
// || 3000;
 const port= process.env.PORT;

app.listen(port,()=>{
    console.log(`Serving at port ${port}`)
})
