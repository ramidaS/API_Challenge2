# API_Test_RS

 **Getting Started**
 This test for API challenge is using mocha framework. There are 5 APIs including in the test as following:
1) Place Order
2) Fetch Order Details
3) Driver to Take the Order
4) Driver to Complete the Order
5) Cancel Order

**Pre-requisite**
1) cd to root folder.
2) run command `npm install` at root folder.

**Running the test**
There are 6 test files as following:
1) testPlaceOrder.js: for placing order without specific order time.
2) testScheduleOrder.js: for placing order with specific order time.
3) testTakeOrder.js: for testing when driver takes orders.
4) testCompleteOrder.js: for testing when driver completes orders.
5) testCancelOrder.js: for testing when order is cancelled.
6) testOrderdetail.js: for testing get order detail scenarios.

There are other 4files for functions supported the tests.

*Step to run the test*
1) After installation successfully, cd to root folder
2) run `npm test run`
3) There will be a report generated after run in `mochawesome-report` folder.

**Author**
Ramida Sakchaisomboon
