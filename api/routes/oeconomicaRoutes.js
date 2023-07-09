"use strict";

const router = require("express").Router(),
    oeconomicaController = require("../controllers/oeconomicaController");

router.get("/", oeconomicaController.read);
router.get("/Yeardatas", oeconomicaController.read2);
router.post("/", oeconomicaController.create);
router.put("/:id", oeconomicaController.update);
router.delete("/:id", oeconomicaController.delete);

module.exports = router;