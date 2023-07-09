var express = require('express');
var router = express.Router();

const oeconomicaRoutes = require("./oeconomicaRoutes");
router.use("/oeconomica", oeconomicaRoutes);
//この2行を追加
const subscriptionRoutes = require("./subscriptionRoutes");
router.use("/subscription", subscriptionRoutes);
const categoryRoutes = require("./categoryRoutes");
router.use("/category", categoryRoutes);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
