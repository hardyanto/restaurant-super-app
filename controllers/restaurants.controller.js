const e = require("express");
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

/* List all restaurants that are open at a certain datetime */
exports.getOpenRestaurants = async (req, res, next) => {
  if (!req.query.day || !req.query.time) {
    next();
  } else {
    const day = req.query.day;
    const time = req.query.time;
    try {
      const results =  await pool.query(`SELECT DISTINCT opening_hours.restaurantName, opening_hours.dayStart, opening_hours.dayEnd, opening_hours.openTime, opening_hours.closeTime FROM restaurant, opening_hours WHERE dayStart = $1 AND openTime = $2`, [day, time]);
      res.status(200).send(results.rows);
    } catch (err) {
      res.status(400).send({"error" : "Unexpected error occurs! Might be due to invalid input"});
    }
  }
};

/* List top y restaurants that have more or less than x number of dishes within a price range 
  Return list of restaurant names with their number of dishes 
  That have more or less than x number of dishes 
  (comparison = 0 means less than or equal to noOfDishes and comparison 1 means more than or equal to noOfDishes) 
  Within priceRangeStart and priceRangeEnd (both inclusive)
  Top refers to the top y restaurants to be returned
*/
exports.getTopRestaurants = async (req, res, next) => {
  if (!req.query.noOfDishes || !req.query.priceRangeStart || !req.query.comparison || !req.query.top) {
    next();
  } else {
    const noOfDishes = req.query.noOfDishes;
    const priceRangeStart = req.query.priceRangeStart;
    const priceRangeEnd = req.query.priceRangeEnd;
    const comparison = req.query.comparison;
    const top = req.query.top;
  
    try {
      let results = null;
      if (comparison == 0) { // less than or equal to noOfDishes
        results =  await pool.query(`SELECT restaurant.restaurantName, count(menu.id) FROM restaurant, menu WHERE price >= $1 AND price <= $2 AND restaurant.restaurantName = menu.restaurantName GROUP BY restaurant.restaurantName HAVING count(menu.id) <= $3 ORDER BY count(menu.id) DESC LIMIT $4`, [priceRangeStart, priceRangeEnd, noOfDishes, top]);
      } else if (comparison == 1) { // more than or equal to noOfDishes
        results =  await pool.query(`SELECT restaurant.restaurantName, count(menu.id) FROM restaurant, menu WHERE price >= $1 AND price <= $2 AND restaurant.restaurantName = menu.restaurantName GROUP BY restaurant.restaurantName HAVING count(menu.id) >= $3 ORDER BY count(menu.id) DESC LIMIT $4`, [priceRangeStart, priceRangeEnd, noOfDishes, top]);
      }
      res.status(200).send(results.rows);
    } catch (err) {
      res.status(400).send({"error" : "Unexpected error occurs! Might be due to invalid input"});
    }
  }
};
  
/* Search for restaurants or dishes by name, ranked by relevance to search term 
  Return list of restaurants or name but cannot be both
  Ranked by relevance to search term 
*/
exports.search = async (req, res, next) => {
  //TODO: implement search 
};