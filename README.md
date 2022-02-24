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

![Alt text](images/restaurantSuperApp-database-design.png "DB Design")

