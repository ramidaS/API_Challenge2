const axios = require('axios')
const config = require('./config')
const allAPIsFunctions = require('./allAPIsFunctions')
var checkResponse = require('./checkResponse')
var chai = require('chai')
    , chaiHttp = require('chai-http')
var expect = require('expect')
var should = require('chai').should()
chai.use(chaiHttp)
const calculationFunctions = require('./calculationFunctions')
var moment = require('moment')
moment().format();

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

	it('1: should return HTTP 200 and get ASSIGNING order detail successfully for normal flow.', async function(){
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkResponse.checkGetOrderDetail(orderInfo, 200, orderId, 'ASSIGNING')
	})

	it('2: should return HTTP 200 and get ONGOING order detail successfully for normal flow.', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkResponse.checkGetOrderDetail(orderInfo, 200,orderId, 'ONGOING')

	})

	it('3: should return HTTP 200 and get COMPLETED order detail successfully for normal flow.', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		await allAPIsFunctions.driverCompleteOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkResponse.checkGetOrderDetail(orderInfo, 200, orderId, 'COMPLETED')

	})

	it('4: should return HTTP 200 and get ASSIGNING > CANCELLED order detail successfully for normal flow.', async function(){
		await allAPIsFunctions.cancelOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkResponse.checkGetOrderDetail(orderInfo, 200, orderId, 'CANCELLED')

	})

	it('5: shouel return HTTP 200 and get ONGOING > CANCELLED order detail successfully for normal flow.', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		await allAPIsFunctions.cancelOrder(orderId)
		let orderInfo = await allAPIsFunctions.getOrderDetails(orderId)
		checkResponse.checkGetOrderDetail(orderInfo, 200, orderId, 'CANCELLED')

	})

	it('6: should return HTTP 404 because get orderId is not exists.', async function(){
		let invalidOrderinfo = await allAPIsFunctions.getOrderDetails('9999999')			//Assume that order Id 9999999 isn't exists.
		checkResponse.checkGetOrderDetail(invalidOrderinfo, 404)
	})

	it('7: should return HTTP 404 because get orderId format is invalid', async function(){
		let invalidOrderinfo = await allAPIsFunctions.getOrderDetails('abc')			//Assume that order Id 9999999 isn't exists.
		invalidOrderinfo.status.should.equal(404)
		invalidOrderinfo.data.should.equal('404 page not found\n')
	})
})