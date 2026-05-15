const express = require("express");
const router = express.Router();

const BGRequest = require("../models/BGRequest");


// CREATE BG REQUEST
router.post("/", async (req, res) => {

  try {

    const newRequest = new BGRequest(req.body);

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "BG Request Submitted Successfully",
      data: savedRequest,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to submit BG Request",
      error: error.message,
    });

  }

});


// GET ALL BG REQUESTS
router.get("/", async (req, res) => {

  try {

    const requests = await BGRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json(requests);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });

  }

});


// UPDATE STATUS
router.put("/:id", async (req, res) => {

  try {

    const updatedRequest = await BGRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: updatedRequest,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });

  }

});

module.exports = router;