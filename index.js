const express = require("express");
const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
const path = require("path");
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const app = express();
const connectDB = require("./config/db.js")
dotenv.config({ path: path.resolve(__dirname, '.env') });
connectDB();

const PORT = process.env.PORT || 8000;


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/public", express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", UserRoute);
app.use("/blog", BlogRoute);
app.listen(PORT, () => console.log("server started on Port", PORT));
