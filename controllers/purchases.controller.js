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

/* Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction 
    Update restaurant, user tables
    Insert into purchase_history table
*/
exports.processPurchase = async (req, res, next) => {
    const userName = req.body.userName;
    const dishName = req.body.dishName;
    const restaurantName = req.body.restaurantName;
    ;(async () => {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        let result = await client.query(`SELECT price FROM menu WHERE dishName = $1 AND restaurantName = $2`, [dishName, restaurantName]);
        const price = result.rows[0].price;
        result = await client.query(`SELECT MAX(transactionId) AS newId FROM purchase_history`);
        const transactionId = result.rows[0].newid;
        const dateTime = new Date().toISOString();
        result = await client.query(`INSERT INTO "purchase_history"(transactionId, transactionAmount, transactionDate, restaurantName, dishName)VALUES($1, $2, $3, $4, $5)`, [transactionId, price, dateTime, restaurantName, dishName]);
        result = await client.query(`UPDATE "user" SET cashBalance = cashBalance - $1 WHERE userName = $2`, [price, userName]);
        result = await client.query(`UPDATE "restaurant" SET cashBalance = cashBalance + $1 WHERE restaurantName = $2`, [price, restaurantName]);
        await client.query('COMMIT')
        console.log("COMMIT")
        res.status(201).send({"message" : "Successfully create purchase"});
      } catch (e) {
        await client.query('ROLLBACK')
        console.log("ROLLBACK")
        res.status(400).send({"error" : "Unexpected error occurs! Cannot proceed transaction"});
        //throw e
      } finally {
        client.release()
      }
    })().catch(e => console.error(e.stack))
};

//TODO
// For our new next API
exports.next = async (req, res, next) => {
  res.status(400).send({"error" : "Unexpected error occurs! Might be due to invalid input"});
};