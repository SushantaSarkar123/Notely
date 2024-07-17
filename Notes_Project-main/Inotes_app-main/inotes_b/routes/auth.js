const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const SECRET_KEY = "TESTSECRETKEY";
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
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false,errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success:false, error: "User already exists with this email" });
      }
      let salt = await bcrypt.genSalt(10);
      let secpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      const data = {
        user: {
          id: user.Id,
        },
      };
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
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            res.status(500).json({ error: "Server error 500" });
        }
    }
);

module.exports = router;
