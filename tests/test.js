const request = require("supertest");
const app = require("../app");

describe('GET /restaurants', function(){

  /* Test listing all restaurants that are open at a certain datetime 
  Where day is Mon, Tues, Weds, Thurs, Fri, Sat or Sun
  And datetime in the format of hh:mm in the 24 hour format.. e.g 09:00 or 13:00
  */
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ day: "Mon", time: '09:00' })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })

  // Test typo query param value, e.g. "Afternoon" for time instead of a time in 24:00 format.. e.g 13:00 or 09:00
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ day: "Mon", time: 'Afternoon' })
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })

  /* Test listing top y restaurants that have more or less than x number of dishes within a price range 
  Return list of restaurant names with their number of dishes 
  That have more or less than x number of dishes 
  (comparison = 0 means less than or equal to noOfDishes and comparison 1 means more than or equal to noOfDishes) 
  Within priceRangeStart and priceRangeEnd (both inclusive)
  Top refers to the top y restaurants to be returned
  */
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ noOfDishes: 3, priceRangeStart: 1, priceRangeEnd: 13.18, top: 4, comparison: 0 })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })

  // Test typo query param key, e.g noOfDishess instead of noOfDishes
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ noOfDishess: 3, priceRangeStart: 1, priceRangeEnd: 13.18, top: 4, comparison: 0 }) 
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })

  // Test typo query param value, e.g. "Mon" for noOfDishes instead of a numeric value
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ noOfDishes: "Mon", priceRangeStart: 1, priceRangeEnd: 13.18, top: 4, comparison: 0 }) 
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res){  
        if (err) return done(err);
        done()
      });
  })

  /* Test search for restaurants or dishes by name, ranked by relevance to search term 
  Return list of restaurants or name but cannot be both
  Ranked by relevance to search term 
  */
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ name: "Rooftoop at E11EVEN" }) 
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){  
        if (err) return done(err);
        done()
      });
  })

  /* Test search for restaurants or dishes by name, ranked by relevance to search term 
  Return list of restaurants or name but cannot be both
  Ranked by relevance to search term 
  */
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ name: "Strained Ox-Tail in Cup" }) 
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){  
        if (err) return done(err);
        done()
      });
  })

  /* Test search for restaurants or dishes by name, ranked by relevance to search term 
  Return list of restaurants or name but cannot be both
  Ranked by relevance to search term 
  */
  it('respond with json', function(done){
    request(app)
      .get('/v1/restaurants')
      .query({ name: 200 }) // Even though name is a number, we just treat it as a correct restaurant or dish name. But results might be empty.
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){  
        if (err) return done(err);
        done()
      });
  })
});

describe('POST /purchases', function(){
  /* Test processing a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction 
      Update restaurant, user tables
      Insert into purchase_history table
  */
  it('respond with json', function(done) {
    request(app)
      .post('/v1/purchases')
      .send(
        {
          userName: "Edward Gonzalez",
          dishName: "Zeltinger [Moselle Wine]",
          restaurantName: "Rooftoop at E11EVEN"
        }
      )
      .expect(201)
      .end(function(err, res){  
        if (err) return done(err);
        done()
      });
  });
});