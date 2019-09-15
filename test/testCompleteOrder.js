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


describe('/Put completeOrder', function(){

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


	it('1: should return HTTP 200 and complete ONGOING order successfully for normal flow.', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkResponse.checkCompleteOrder(completeOrder,orderId,200,'COMPLETED')

	})

	it('2: should return HTTP 422 because ASSIGNING order could not be completed.', async function(){
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkResponse.checkCompleteOrder(completeOrder,orderId,422)

	})

	it('3: should return HTTP 422 because CANCELLED order could not be completed.', async function(){
		await allAPIsFunctions.cancelOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkResponse.checkCompleteOrder(completeOrder,orderId,422)
	})

	it('4: should return HTTP 422 because the order was completed already.', async function(){
		await allAPIsFunctions.driverCompleteOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkResponse.checkCompleteOrder(completeOrder,orderId,422)
	})

	it('5: should return HTTP 404 because orderId format is invalid.', async function(){
		let completeOrder = await allAPIsFunctions.driverCompleteOrder('abc')
		completeOrder.status.should.equal(404)
		completeOrder.data.should.equal('404 page not found\n')
	})

	it('6: should return HTTP 404 because orderId is not valid', async function(){
		let completeOrder = await allAPIsFunctions.driverCompleteOrder('9999999')			//assume that orderId '9999999' isn't valid
		checkResponse.checkCompleteOrder(completeOrder,orderId,404)
	})

})
