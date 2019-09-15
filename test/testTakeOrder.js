const axios = require('axios')
const config = require('./config')
const allAPIsFunctions = require('./allAPIsFunctions')
var chai = require('chai')
    , chaiHttp = require('chai-http')
var expect = require('expect')
var should = require('chai').should()
chai.use(chaiHttp)
const calculationFunctions = require('./calculationFunctions')
var moment = require('moment')
moment().format();

let responseBody = []
let expectedStatusCode = 200
let expectedOrderStatus = 'ASSIGNING'

function checkResponse(responseBody, expectedStatusCode, expectedOrderStatus){
		if(responseBody.status === 200){
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.status.should.equal(expectedOrderStatus)
			responseBody.data.should.have.property('ongoingTime')
			console.log('pass 200')

		}
		else if(responseBody.status === 422)
		{
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.should.have.property('message')
			responseBody.data.message.should.equal('Order status is not ASSIGNING')
			console.log('pass 422')
		}
		else if(responseBody.status === 404)
		{	
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.should.have.property('message')
			responseBody.data.message.should.equal('ORDER_NOT_FOUND')
			console.log('pass 404')
		}
		else{
			console.log('invalid')
		}

	}


describe('Put /takeOrder', function(){
	let scheduledTime = new Date("2019-09-15T15:10:18.061Z")
	let orderAt = moment.utc(scheduledTime)
	let orderId = 0
	let locations = [
	    {
	        "lat": 22.344674, "lng": 114.124651
	    },
	    {
	        "lat": 22.375384, "lng": 114.182446
	    },
	    {
	        "lat": 22.385669, "lng": 114.186962
	    }
	]
	let responseBody = []

	beforeEach(async function(){
		let response = await allAPIsFunctions.scheduleOrder(orderAt,locations)
		orderId = response.data.id
		return response, orderId
	})

	it('1: take normal order', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		console.log(takeOrder.status, takeOrder.data)
		checkResponse(takeOrder, 200, 'ONGOING')
	})

	it('2: test non-existing order id', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder('9999999')				//Assume that order Id 9999999 isn't exists
		console.log(takeOrder.status, takeOrder.data)
		checkResponse(takeOrder, 404)
	})

	it('3: take invalid order id', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder('abc')
		takeOrder.status.should.equal(404)
		takeOrder.data.should.equal('404 page not found\n')
		//checkResponse(takeOrder, 404)
		//404 page not found\n
	})

	it('4: take order which is already taken', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		checkResponse(takeOrder2, 422)
	})

	it('5: take order which is already completed.', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		checkResponse(takeOrder2, 422)
	})

	it('6: take order which is already cancelled.', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let cancelOrder = await allAPIsFunctions.cancelOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		checkResponse(takeOrder2, 422)
	})
})
