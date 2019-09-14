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
		console.log('pass 200')
	}
	else if(responseBody.status === 404)
		{	
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.should.equal('404 page not found\n')
			console.log('pass 404')
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
		console.log('orderInfo: '+ orderInfo.data.id)
		checkGetOrderDetail(orderInfo, 200, orderId, 'ASSIGNING')

	})

	it('2: get ONGOING order detail', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		console.log('orderInfo: '+ orderInfo.data.id)
		checkGetOrderDetail(orderInfo, 200,orderId, takeOrder.data.status)

	})

	it('3: get COMPLETED order detail', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		console.log(completeOrder.data.status)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		console.log('orderInfo: '+ orderInfo.data.id)
		checkGetOrderDetail(orderInfo, 200, orderId, completeOrder.data.status)

	})

	it('4: get ASSIGNING > CANCELLED order detail', async function(){
		let cancelOrder = await allAPIsFunctions.cancelOrder(orderId)
		console.log(cancelOrder.data.status)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		console.log('orderInfo: '+ orderInfo.data.id)
		checkGetOrderDetail(orderInfo, 200, orderId, cancelOrder.data.status)

	})

	it('5: get ONGOING > CANCELLED order detail', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		let cancelOrder = await allAPIsFunctions.cancelOrder(orderId)
		console.log(cancelOrder.data.status)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		console.log('orderInfo: '+ orderInfo.data.id)
		checkGetOrderDetail(orderInfo, 200, orderId, cancelOrder.data.status)

	})

	it('6: get invalid order detail', async function(){
		let invalidOrderinfo = await allAPIsFunctions.getOrderDetails('abc')
		console.log(invalidOrderinfo)
		checkGetOrderDetail(invalidOrderinfo, 404)
	})
})