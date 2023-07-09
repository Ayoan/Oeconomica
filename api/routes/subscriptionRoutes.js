"use strict";

const router = require("express").Router(),
    subscriptionController = require("../controllers/subscriptionController");

router.get("/", subscriptionController.read);
router.post("/", subscriptionController.create);
router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);

module.exports = router;