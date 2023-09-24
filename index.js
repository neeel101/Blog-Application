const express = require("express");
const UserRoute = require("./routes/user")
const BlogRoute = require("./routes/blog")
const path = require("path")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")
const app = express();
const PORT = 8000;
const {connect} = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");


connect("mongodb://127.0.0.1:27017/blogDB").then(()=>console.log("mongo DB Connected") )

app.set("view engine" , "ejs"); 
app.set("views", path.resolve("./views"))
app.use('/public', express.static('public'));

app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user, 
        blogs : allBlogs
    })
}) 

app.use("/user", UserRoute)
app.use("/blog", BlogRoute)
app.listen(PORT, () => console.log("server started on Port", PORT));
 