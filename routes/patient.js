const express = require("express");
const router = express.Router();


const {
   setPatients,
   getbestgradepatients
} = require("../controllers/patient");



router.post("/setpatients",setPatients);
router.post("/getpatients",getpatients);
module.exports = router;