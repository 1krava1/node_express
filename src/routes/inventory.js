var express = require('express');
var router = express.Router();
var InventoryService = require('../services/inventory');

/* GET home page. */
router.get('/:steamID/:game/:refresh?', function(req, res, next) {
  InventoryService.getInventory(req, res, next);
});

module.exports = router;
