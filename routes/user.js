const { User } = require("../models/user");
const { Router } = require("express");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
    fullName,
    email,
    password,
  }); 
  res.redirect("/");
  } catch (error) {
    res.render("signup", {Error : "email already exists ! Please SIgnIn"})
  }
  
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchedPasswordAndGenerateToken(email, password);
   return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      Error: "invailid login please try again ! ",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/")
})
module.exports = router;
