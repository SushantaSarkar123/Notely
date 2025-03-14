const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;//

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //checking if there are any errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false,errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      //checking if user already exists
      if (user) {
        return res
          .status(400)
          .json({success:false, error: "User already exists with this email" });
      }
      //creating salt with 10 rounds
      let salt = await bcrypt.genSalt(10);
      //hashing the password with salt
      let secpass = await bcrypt.hash(req.body.password, salt);
      //creating user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      //creating payload for jwt token
      const data = {
        user: {
          id: user._id, //id: user.Id,
        },
      };
      //signing the payload with secret key (made with user id and secret key)
      const AUTH_TOKEN = jwt.sign(data, SECRET_KEY);
      res.json({success:true, AUTH_TOKEN });
    } catch (error) {
      res.status(500).json({success:false, error: "Server error 500" });
    }
  }
);

router.post(
  "/login", [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password must be atleast 5 characters").isLength({
        min: 5,
      }),
    ],
    async (req,res)=>{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ success:false, errors: errors.array() });
      }

      const {email, password} = req.body;
      try{
          let user = await User.findOne({ email });
          if(!user){
              res.status(400).error({success:false, error : "Please input correct credentials"});
          }
          bcrypt.compare(password , user.password).then(function(result) {
              if(!result){
                  res.status(400).json({success:false, error : "Please input correct credentials"});
              }else{
                  const payload = {
                      user: {
                      id: user.id,
                      },
                  };
                  const AUTH_TOKEN = jwt.sign(payload, SECRET_KEY);
                  res.json({success:true,AUTH_TOKEN})
              }
          }).catch(err => res.status(500).json({ success:false, error: "Server error 500" }));
      }catch(error){
          res.status(500).json({success:false, error: "Server error 500" });
      }
  }
);


router.post(
    "/getuser", fetchUser, 
    async (req,res)=>{
        try {
            let userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.json(user); // Ensure this is a valid JSON response
        } catch (error) {
            res.status(500).json({ error: "Server error 500" });
        }
    }
);

module.exports = router;
