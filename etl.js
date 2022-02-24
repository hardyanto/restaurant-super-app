const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgres://djqvtiyrquqyyi:ee4631f5188d53518522f86e05334c69e705096c9915a3faf4ec89b075af407b@ec2-3-222-49-168.compute-1.amazonaws.com:5432/dbipdsbp1dnt4",
  ssl: {
    rejectUnauthorized: false,
  },
});

const moment = require("moment");

const fs = require("fs");
const path = require("path");

const rawdata = fs.readFileSync(path.resolve(__dirname, "restaurants.json"));
const restaurants = JSON.parse(rawdata);
const usersWithPurchaseHistoryRawData = fs.readFileSync(path.resolve(__dirname, "users_with_purchase_history.json"));
const usersWithPurchaseHistories = JSON.parse(usersWithPurchaseHistoryRawData);

/* Schema */
async function dropSchema() {
  try {
    const results = await pool.query(`drop schema if exists public cascade`);
  }
  catch (err) {
    throw err
  }
}

async function createSchema() {
  try {
    const results = await pool.query(`create schema public`);
  }
  catch (err) {
    throw err
  }
}

/* Create Table */
async function createTableQuery(query, tableName) {
  try {
    const results = await pool.query(query);
  }
  catch (err) {
    console.log("[" + tableName + "] ", err);
    throw err
  }
}

/* Insert Table */
async function insertTableQuery(query, values, tableName) {
  try {
    const results = await pool.query(query, values);
  }
  catch (err) {
    console.log("[" + tableName + "] ", err);
    throw err
  }
}

(async () => {
  await dropSchema();
  await createSchema();
  await createTableQuery(`CREATE TABLE "restaurant"(restaurantName VARCHAR PRIMARY KEY, cashBalance NUMERIC)`, "restaurant");
  await createTableQuery(`CREATE TABLE "opening_hours"(id SERIAL PRIMARY KEY, dayStart VARCHAR, dayEnd VARCHAR, openTime TIME, closeTime TIME, restaurantName VARCHAR)`, "opening_hours");
  await createTableQuery(`CREATE TABLE "menu"(id SERIAL PRIMARY KEY, dishName VARCHAR, price NUMERIC, restaurantName VARCHAR REFERENCES restaurant(restaurantName) ON DELETE RESTRICT)`, "menu");
  await createTableQuery(`CREATE TABLE "user"(userName VARCHAR PRIMARY KEY, cashBalance NUMERIC, constraint balance_nonnegative check (cashBalance >= 0))`, "user");
  await createTableQuery(`CREATE TABLE "purchase_history"(id SERIAL PRIMARY KEY, transactionId INT, transactionAmount NUMERIC, transactionDate TIMESTAMP, restaurantName VARCHAR, dishName VARCHAR)`, "purchase_history");

  for (let restaurant of restaurants) {
    const restaurantName = restaurant.restaurantName;
    const cashBalance = restaurant.cashBalance;

    await insertTableQuery(`INSERT INTO "restaurant"(restaurantName, cashBalance)VALUES($1, $2)`, [restaurantName, cashBalance], "restaurant");
    const openingHours = restaurant.openingHours;

    // Since opening hours are 
    // In the format of "openingHours": "Mon - Weds, Sat 11 am - 10:15 pm / Thurs 8:30 am - 2:30 am / Fri 6 am - 3:15 am / Sun 3:45 pm - 4:15 pm",
    // Let's convert this string into array by splitting "/"
    let openingHoursArray = openingHours.split("/");
    for (individualOpeningHours of openingHoursArray) {
      // Then we need to trim all whitespaces even between each character
      // For easier processing
      individualOpeningHoursTrim = individualOpeningHours.replaceAll(' ','');

      dayStr = "";
      hoursRangeStr = "";
      for (let i = 0; i < individualOpeningHoursTrim.length; i++) {
        const ch = individualOpeningHoursTrim[i];

        if (!isNaN(ch)) {
          // E.g if individualOpeningHoursTrim is Mon-Weds,Sat11am-10:15pm (after we trimmed all the whitespaces)
          // We need to extract 11am-10:15pm from it
          // So as long as we first saw a char that is a number, we know it is the beginning of hours range :)
          hoursRangeStr = individualOpeningHoursTrim.slice(
            i,
            individualOpeningHoursTrim.length + 1
          );
          break;
        } else {
          dayStr += ch;
        }
      }

      // if hours range is 11am-10:15pm split into 11am and 10:15pm
      // hence 11am is the hour start
      // and 10:15pm is the hour end (but we will convert it to 24 hour format)
      const hoursRangeArr = hoursRangeStr.split("-");
      const hourStart = hoursRangeArr[0];
      const convertedTimeHourStart = moment(hourStart, 'hh:mm A').format('HH:mm')
      const hourEnd = hoursRangeArr[1];
      const convertedTimeHourEnd = moment(hourEnd, 'hh:mm A').format('HH:mm')

      daysArray = dayStr.split(",");
      for (let day of daysArray) {
        // if day is Mon-Weds
        // extract Mon as daystart and Weds as dayend
        if (day.includes("-")) {
          dayStart = day.split("-")[0];
          dayEnd = day.split("-")[1];
          insertTableQuery(`INSERT INTO "opening_hours"(dayStart, dayEnd, openTime, closeTime, restaurantName)VALUES($1, $2, $3, $4, $5)`, [dayStart, dayEnd, convertedTimeHourStart, convertedTimeHourEnd, restaurantName], "opening_hours");
        } else {
          insertTableQuery(`INSERT INTO "opening_hours"(dayStart, dayEnd, openTime, closeTime, restaurantName)VALUES($1, $2, $3, $4, $5)`, [day, day, convertedTimeHourStart, convertedTimeHourEnd, restaurantName], "opening_hours");
        }
      }
    }

    const menu = restaurant.menu;
    for (let m of menu) {
      const dishName = m.dishName;
      const price = m.price;

      try {
        insertTableQuery(`INSERT INTO "menu"(dishName, price, restaurantName)VALUES($1, $2, $3)`, [dishName, price, restaurantName], "menu");

      } catch (err) {
        console.log("error when inserting menu ", err);
      }
    }
  }

  for (let userWithPurchaseHistories of usersWithPurchaseHistories) {
    const userName =   userWithPurchaseHistories.name;
    const cashBalance = userWithPurchaseHistories.cashBalance;
    const transactionId = userWithPurchaseHistories.id;
    const purchaseHistory = userWithPurchaseHistories.purchaseHistory;

    insertTableQuery(`INSERT INTO "user"(userName, cashBalance)VALUES($1, $2)`, [userName, cashBalance], "user");

    for (let eachHistory of purchaseHistory) {
      const transactionAmount = eachHistory.transactionAmount;
      const dishName = eachHistory.dishName;
      const restaurantName = eachHistory.restaurantName;
      const transactionDate = eachHistory.transactionDate;
      insertTableQuery(`INSERT INTO "purchase_history"(transactionId, transactionAmount, transactionDate, restaurantName, dishName)VALUES($1, $2, $3, $4, $5)`, [transactionId, transactionAmount, transactionDate, restaurantName, dishName], "purchase_history");

    }
  }
  // Means db and everything has been setup
  console.log("DONE WITH DATABASE SETUP");
})();

console.log("END");

