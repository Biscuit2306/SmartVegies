const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/test", (req,res)=>{
  res.json({message:"Auth routes working"});
});


module.exports = router;