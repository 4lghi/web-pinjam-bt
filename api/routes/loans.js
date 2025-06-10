const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

router.post("/", loansController.createLoan);

router.get("/", loansController.getLoans);

router.patch("/:id", loansController.updateLoan);

router.delete("/:id", loansController.deleteLoan);

// NEW NEW NEW NEW
router.post("/bukuTanah", loansController.createBt);
router.post("/suratUkur", loansController.createSu);

router.get("/bukuTanah", loansController.getBt);
router.get("/suratUkur", loansController.getSu);

router.patch("/bukuTanah/:id", loansController.updateBt);
router.patch("/suratUkur/:id", loansController.updateSu);

// router.delete("/bukuTanah/:id", loansController.deleteBtLoan);
// router.delete("/suratUkur/:id", loansController.deleteSuLoan);

module.exports = router;