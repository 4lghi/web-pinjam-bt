const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, loansController.createLoan);

router.get("/", verifyToken, loansController.getLoans);

router.patch("/:id", verifyToken, loansController.updateLoan);

router.delete("/:id", verifyToken, loansController.deleteLoan);

// NEW NEW NEW NEW
router.post("/bukuTanah", verifyToken, loansController.createBt);
router.post("/suratUkur", verifyToken, loansController.createSu);

router.get("/bukuTanah", verifyToken, loansController.getBt);
router.get("/suratUkur", verifyToken, loansController.getSu);

router.patch("/bukuTanah/:id", verifyToken, loansController.updateBt);
router.patch("/suratUkur/:id", verifyToken, loansController.updateSu);

// router.delete("/bukuTanah/:id", loansController.deleteBtLoan);
// router.delete("/suratUkur/:id", loansController.deleteSuLoan);

module.exports = router;
