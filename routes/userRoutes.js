var express = require('express');
var router = express.Router();
const passport = require("passport");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/db')
const Users = require('../models/users');
/* GET users listing. */



router.get('/getAllUsers', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log("user detail :", req.user);

  Users.find().then(allUsers => {
    res.json({ success: true, status: 200, message: "Users found", data: allUsers });
  }).catch(err => {
    res.json({ success: false, status: 400, message: "No data found", data: err });
  })
});



/**
 * @author Umesh
 * @date 04/11/19
 * URL : /api/users/registration
 * Method : Post
 * body/params : {
	        "userName" : "umesh shedligeri",
	        "email" : "umeshbs037@gmail.com",
	        "password" : "12345",
        	"role" : "dealer"
          }
 * Response : {
    "success": true,
    "status": 200,
    "message": "Registered successfully",
    "data": {
        "created_at": "2019-11-05T07:22:46.127Z",
        "_id": "5dc1235963b15753705aaedd",
        "userName": "umesh shedligeri",
        "email": "umeshbs037@gmail.com",
        "companyName": "yfejfwk",
        "address": "efefgoebiu",
        "city": "fjefbekj",
        "state": "ewhfiwf",
        "postalCode": "fhjevhjwvf",
        "password": "$2a$10$E9/JqzR9CxsAy06p5/iHtuaZ0eMpUpTeu2tzk30dvcKfUcTPmJdiK",
        "role": "dealer",
        "__v": 0
    }
}
 * 
 */

router.post('/registration', (req, res) => {
  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ success: false, status: 400, message: "Email already exists", data: user })
    } else {
      let newRegistration = new Users({
        userName: req.body.userName,
        email: req.body.email,
        companyName: req.body.companyName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        password: req.body.password,
        role: req.body.role
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newRegistration.password, salt, (err, hash) => {
          if (err) throw err;
          newRegistration.password = hash;
          newRegistration.save()
            .then(data => {
              // const successUser = {
              //   userName: user.userName,
              //   email: user.email,
              //   role: user.role,
              //   id: user._id,
              //   isLeader: user.isLeader
              // }
              res.json({ success: true, status: 200, message: "Registered successfully", data: data })
            })
            .catch(err => {
              res.json({ success: false, status: 400, message: "Something went wrong", data: err })
            });
        })
      })
    }
  })

})


/**
 * @author Umesh
 * @date 05/11/19
 * URL : /api/users/login
 * Method : Post
 * body/params : {
	"email" : "umeshbs037@gmail.com",
	"password" : "12345"
}
 * Response : {
    "success": true,
    "status": 200,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzEyMzU5NjNiMTU3NTM3MDVhYWVkZCIsImVtYWlsIjoidW1lc2hiczAzN0BnbWFpbC5jb20iLCJyb2xlIjoiZGVhbGVyIiwiaWF0IjoxNTcyOTM4NzY3LCJleHAiOjE1NzM1NDM1Njd9.Z1_v0FldtZ3_LYM4p1zg3mo9LuM_REP24hUtsNVV2dA",
    "message": "Login Successfull",
    "data": {
        "id": "5dc1235963b15753705aaedd",
        "email": "umeshbs037@gmail.com",
        "role": "dealer"
    }
}
 * 
 */

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  //Find User by Email
  Users.findOne({ email })
    .then(user => {
      if (!user) {
        // errors.email = 'User not found'
        return res.json({ success: false, status: 400, message: "You have entered wrong email !", data: null });
      }
      //Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User Matched
            console.log("user :", user);
            const Payload = { id: user.id, name: user.name, email: user.email, role: user.role }; //Create JWT Payload
            jwt.sign(Payload, keys.secretOrKeys, { expiresIn: 604800 }, (err, token) => {
              res.json({
                success: true,
                status: 200,
                token: "Bearer " + token,
                message: "Login Successfull",
                data: Payload
              });
            });
          } else {
            return res.json({ success: false, status: 400, message: "You have entered wrong password !", data: null });
          }
        }).catch(err => {
          res.json({ success: false, status: 400, message: "Something went wrong", data: err });
        });
    }).catch(err => {
      res.json({ success: false, status: 400, message: "Bad request", data: err });
    });
});

module.exports = router;
