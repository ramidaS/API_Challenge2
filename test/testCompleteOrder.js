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

function checkCompleteOrder(responseBody, orderId, expectedStatusCode, expectedOrderStatus){
		if(responseBody.status === 200){
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.status.should.equal(expectedOrderStatus)
			responseBody.data.should.have.property('completedAt')
			responseBody.data.should.have.property('id')
			responseBody.data.id.should.equal(orderId)
			console.log('pass 200')

		}
		else if(responseBody.status === 422)
		{
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.should.have.property('message')
			responseBody.data.message.should.equal('Order status is not ONGOING')
			console.log('pass 422')
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


	it('1: complete normal order', async function(){
		await allAPIsFunctions.driverTakeOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkCompleteOrder(completeOrder,orderId,200,'COMPLETED')

	})

	it('2: complete an assigning order', async function(){
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkCompleteOrder(completeOrder,orderId,422)

	})

	it('3: complete cancelled order', async function(){
		await allAPIsFunctions.cancelOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkCompleteOrder(completeOrder,orderId,422)
	})

	it('4: complete completed order', async function(){
		await allAPIsFunctions.driverCompleteOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		checkCompleteOrder(completeOrder,orderId,422)
	})

	it('5: complete invalid order', async function(){
		let completeOrder = await allAPIsFunctions.driverCompleteOrder('abc')
		checkCompleteOrder(completeOrder,orderId,404)
	})

})
