const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

router.post("/", loansController.createLoan);

router.get("/", loansController.getLoans);

router.patch("/:id", loansController.updateLoan);

router.delete("/:id", loansController.deleteLoan);

module.exports = router;