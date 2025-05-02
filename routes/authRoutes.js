const express = require('express');
const router = express.Router();
const {register} = require("../controllers/authController");

const {
  verifyOTP,
  login,
  getUserData,
  getAdminData,
  logout
} = require("../controllers/authController");

const { isAuthenticated } = require('../middlewares/authMiddleware'); 
const { authorize } = require('../middlewares/roleMiddleware');    

router.post("/sign-up", register);
router.post("/sign-up/otp", verifyOTP); 
router.post("/login", login);

router.get("/user", isAuthenticated, authorize("user"), getUserData );
router.get("/admin", isAuthenticated, authorize("admin"), getAdminData)

router.get("/user/logout", isAuthenticated, logout);
router.get("/admin/logout", isAuthenticated, logout);

module.exports = router;
