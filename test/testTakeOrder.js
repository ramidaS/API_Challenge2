const axios = require("axios");
const config = require("./config");
const allAPIsFunctions = require("./allAPIsFunctions");
var checkResponse = require("./checkResponse");
var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = chai.expect;
var should = chai.should();
const calculationFunctions = require("./calculationFunctions");
var moment = require("moment");
moment().format();

var today = new Date();

describe("Put /takeOrder", function(){

	var orderAt = moment.utc(today).add(1, "day");
	var orderId = 0;
	var locations = [
	    {
	        "lat": 22.344674, "lng": 114.124651
	    },
	    {
	        "lat": 22.375384, "lng": 114.182446
	    },
	    {
	        "lat": 22.385669, "lng": 114.186962
	    }
	];
	var responseBody = [];

	beforeEach(async function(){
		var response = await allAPIsFunctions.scheduleOrder(orderAt,locations);
		orderId = response.data.id;
		return response, orderId;
	})

	it("1: Should return HTTP 200 and driver takes order successfully for normal flow.", async function(){
		var takeOrder = await allAPIsFunctions.driverTakeOrder(orderId);
		checkResponse.checkTakeOrderResponse(takeOrder, 200, "ONGOING");
	})

	it("2: Should return HTTP 404 because driver takes non-existing order.", async function(){
		var takeOrder = await allAPIsFunctions.driverTakeOrder("9999999");				//Assume that order Id 9999999 isn"t exists
		checkResponse.checkTakeOrderResponse(takeOrder, 404);
	})

	it("3: Should return HTTP 404 because orderId format is invalid.", async function(){
		var takeOrder = await allAPIsFunctions.driverTakeOrder("abc");
		takeOrder.status.should.equal(404);
		takeOrder.data.should.equal("404 page not found\n");
	})

	it("4: Should return HTTP 422 because the order is already taken.", async function(){
		var takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId);
		var takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId);
		checkResponse.checkTakeOrderResponse(takeOrder2, 422);
	})

	it("5: Should return HTTP 422 because the order is already completed.", async function(){
		var takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId);
		var completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId);
		var takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId);
		checkResponse.checkTakeOrderResponse(takeOrder2, 422);
	})

	it("6: Shoudl return HTTP 422 because the order is alreayd cancelled.", async function(){
		var takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId);
		var cancelOrder = await allAPIsFunctions.cancelOrder(orderId);
		var takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId);
		checkResponse.checkTakeOrderResponse(takeOrder2, 422);
	})
})
