var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgres://djqvtiyrquqyyi:ee4631f5188d53518522f86e05334c69e705096c9915a3faf4ec89b075af407b@ec2-3-222-49-168.compute-1.amazonaws.com:5432/dbipdsbp1dnt4",
  ssl: {
    rejectUnauthorized: false,
  },
});

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://hardy@localhost:5432/hardy')
const restaurantsController = require('../controllers/restaurants.controller');

router.get('/', restaurantsController.getOpenRestaurants);
router.get('/', restaurantsController.getTopRestaurants);
router.get('/', restaurantsController.search);

module.exports = router;
