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
let expectedOrderStatus = 'ONGOING'

function checkGetOrderDetail(responseBody, expectedStatusCode, orderId, expectedOrderStatus){
	if(responseBody.status === 200){
		responseBody.status.should.equal(expectedStatusCode)
		responseBody.data.should.have.property('id')
		responseBody.data.id.should.equal(orderId)
		responseBody.data.should.have.property('stops')
		responseBody.data.should.have.property('drivingDistancesInMeters')
		responseBody.data.should.have.property('fare')
		responseBody.data.should.have.property('status')
		responseBody.data.status.should.equal(expectedOrderStatus)
		responseBody.data.should.have.property('orderDateTime')
		responseBody.data.should.have.property('createdTime')
	}
	else if(responseBody.status === 404)
		{	
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.should.have.property('message')
			responseBody.data.message.should.equal('ORDER_NOT_FOUND')
		}
	else{
		console.log('invalid')
	}
	
}

describe('/get orderDetail', function(){
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

	beforeEach(async function(){
		let response = await allAPIsFunctions.scheduleOrder(orderAt,locations)
		orderId = response.data.id
		return response, orderId
	})

	it('1: get ASSIGNING order detail', async function(){
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkGetOrderDetail(orderInfo, 200, orderId, 'ASSIGNING')
	})

	it('2: get ONGOING order detail', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkGetOrderDetail(orderInfo, 200,orderId, 'ONGOING')

	})

	it('3: get COMPLETED order detail', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		await allAPIsFunctions.driverCompleteOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkGetOrderDetail(orderInfo, 200, orderId, 'COMPLETED')

	})

	it('4: get ASSIGNING > CANCELLED order detail', async function(){
		await allAPIsFunctions.cancelOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkGetOrderDetail(orderInfo, 200, orderId, 'CANCELLED')

	})

	it('5: get ONGOING > CANCELLED order detail', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		await allAPIsFunctions.cancelOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkGetOrderDetail(orderInfo, 200, orderId, 'CANCELLED')

	})

	it('6: get non exisiting order detail', async function(){
		let invalidOrderinfo = await allAPIsFunctions.getOrderDetails('9999999')			//Assume that order Id 9999999 isn't exists.
		checkGetOrderDetail(invalidOrderinfo, 404)
	})

	it('7: get invalid order detail', async function(){
		let invalidOrderinfo = await allAPIsFunctions.getOrderDetails('abc')			//Assume that order Id 9999999 isn't exists.
		invalidOrderinfo.status.should.equal(404)
		invalidOrderinfo.data.should.equal('404 page not found\n')
	})
})