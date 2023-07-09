"use strict";

const router = require("express").Router(),
categoryController = require("../controllers/categoryController");

router.get("/", categoryController.read);
router.post("/", categoryController.create);
// router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

module.exports = router;