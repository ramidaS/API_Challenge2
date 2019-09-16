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

describe("/Put cancelOrder", function(){

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

	it("1: should return HTTP 200 and ASSIGNING order should be cancelled successfully for normal flow.", async function(){
		var cancelledOrder = await allAPIsFunctions.cancelOrder(orderId);
		checkResponse.checkCancelledOrder(cancelledOrder, orderId, 200, "CANCELLED");

	})

	it("2: should return HTTP 200 and ONGOING order should be cancelled successfully for normal flow.", async function(){
		await allAPIsFunctions.driverTakeOrder(orderId);
		var cancelledOrder = await allAPIsFunctions.cancelOrder(orderId);
		checkResponse.checkCancelledOrder(cancelledOrder, orderId, 200, "CANCELLED");
	})

	it("3: should return HTTP 422 because COMPLETED order could not be cancelled.", async function(){
		await allAPIsFunctions.driverTakeOrder(orderId);
		await allAPIsFunctions.driverCompleteOrder(orderId);
		var cancelledOrder = await allAPIsFunctions.cancelOrder(orderId);
		checkResponse.checkCancelledOrder(cancelledOrder, orderId, 422);
	})

	it("4: should return HTTP 200 and CANCELLED order status should not be changed.", async function(){				//This case is expected to be passed as result checked in Postman
		await allAPIsFunctions.driverTakeOrder(orderId);
		await allAPIsFunctions.cancelOrder(orderId);
		var cancelledOrder = await allAPIsFunctions.cancelOrder(orderId);
		checkResponse.checkCancelledOrder(cancelledOrder, orderId, 200, "CANCELLED");
	})				

	it("5: should return HTTP 404 because invalid orderId format", async function(){
		var cancelledOrder = await allAPIsFunctions.cancelOrder("abc");
		cancelledOrder.status.should.equal(404);
		cancelledOrder.data.should.equal("404 page not found\n");
	})

	it("6: should return HTTP 404 because cancelling non-existing order", async function(){			//Assume that orderId = 9999999 is not exists
		var cancelledOrder = await allAPIsFunctions.cancelOrder(9999999);
		checkResponse.checkCancelledOrder(cancelledOrder, orderId, 404);
	})
})