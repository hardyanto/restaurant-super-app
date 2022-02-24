# Heroku URL for this app
https://restaurant-super-app.herokuapp.com/

###### Endpoints created
See documentation for info https://documenter.getpostman.com/view/19748821/UVkpMaKA 

# Command to run the ETL (extract, transform and load) script 
Takes in the raw data sets as input, and outputs to our postgreSQL database in Heroku.
Please run this command on your local machine.

```sh
$ node etl.js
```

###### On completion
Once you run the above command, on the console, you will see "DONE WITH DATABASE SETUP", which means your database has been setup and the tables have been created and inserted with the data from **restaurants.json** and **users_with_purchase_history.json**

# Running jest for testing
We use jest to test our controllers. Please run this command on your local machine (or ideally I am trying to set up a pipeline on Github with Heroku to automatically run the tests)

```sh
$ npm test
```

###### On completion
Once you run the above command (or on the pipeline), hopefully all the test cases are passed :D (it should be otherwise we won't push buggy codes to the repo)

# Command to run our server locally
Since are using ExpressJS and using npm, please run the following command.

```sh
$ DEBUG=myapp:* npm start  
```

###### On completion
Once you run the above command, our server would be started and run.

###### Testing endpoints on postman
We recommend **postman** to test the endpoints. Please install postman if you don't have one or you can use the online version.

###### Documentation: https://documenter.getpostman.com/view/19748821/UVkpMaKA 

![Alt text](public/images/restaurantSuperApp-database-design.png "DB Design")

Assumption: There is no foreign key delete constraint from purchase_history with restaurant and menu as should the restaurant closed (out of business), purchase_history should still be kept for audit purpose etc.

Same goes for opening_hours. Even if the restaurant is out of business, we might want to keep the opening_hours for audit purpose as purchase_history does not keep track of opening hours.

![image](https://user-images.githubusercontent.com/18643648/155514797-3a140e2a-75d8-4f61-862d-f3ac9e4d6287.png)
