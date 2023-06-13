const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const db = require("./config/connection.js");
const usersRoute = require("./routes/usersRoute.js");
const postsRoute = require("./routes/postsRoute.js");
const commentsRoute = require("./routes/commentsRoute.js")
const authRoute = require("./routes/authRoute.js");
const profileRoute = require("./routes/profileRoute.js")
const likePost = require("./routes/likePostRoute.js");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");

const app = express();
dotenv.config();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({db: db});
store.sync().then(() => console.log("session jalan..."));

app.use(session({
    secret: process.env.APP_SECRET_KEY,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));


app.use(cors({
    credentials: true,
    origin: `${process.env.APP_REACT_PORT}`
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use("/accounts", authRoute,usersRoute, profileRoute);
app.use("/posts", postsRoute , likePost, commentsRoute);

(async()=> {
    await db.sync()
    .then(()=> console.log("database connected..."))
})();

app.listen(process.env.APP_PORT, ()=> {
    console.log(`running in port ${process.env.APP_PORT}`)
});