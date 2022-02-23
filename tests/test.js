const request = require("supertest");
const app = require("../app");

describe('GET /restaurants', function(){
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
});