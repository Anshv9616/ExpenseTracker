

const express=require("express");
const {protect}=require("../middleware/authMiddleware");

const {getDashbaordData}=require("../controllers/dashboardController");



const router=express.Router();

router.get("/",protect,getDashbaordData);

module.exports=router;