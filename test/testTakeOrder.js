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

	beforeEach(async function(){
		let response = await allAPIsFunctions.scheduleOrder(orderAt,locations)
		orderId = response.data.id
		return orderId
		})
	

	it('1: take normal order', async function(){
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		console.log(takeOrder.status, takeOrder.data)
		takeOrder.status.should.equal(200)
		takeOrder.data.status.should.equal('ONGOING')
		takeOrder.data.should.have.property('ongoingTime')

	})

	it('2: take invalid order id', async function(){
		orderId = 'abc'
		let takeOrder = await allAPIsFunctions.driverTakeOrder(orderId)
		//console.log(takeOrder)
		takeOrder.status.should.equal(404)
		takeOrder.data.should.equal('404 page not found\n')

	})

	it('3: take order which is already taken', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		takeOrder2.status.should.equal(422)
		takeOrder2.data.should.have.property('message')
		takeOrder2.data.message.should.equal('Order status is not ASSIGNING')

	})

	it('4: take order which is already completed.', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let completeOrder = await allAPIsFunctions.driverCompleteOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		takeOrder2.status.should.equal(422)
		takeOrder2.data.should.have.property('message')
		takeOrder2.data.message.should.equal('Order status is not ASSIGNING')


	})

	it('5: take order which is already cancelled.', async function(){
		let takeOrder1 = await allAPIsFunctions.driverTakeOrder(orderId)
		let cancelOrder = await allAPIsFunctions.cancelOrder(orderId)
		let takeOrder2 = await allAPIsFunctions.driverTakeOrder(orderId)
		takeOrder2.status.should.equal(422)
		takeOrder2.data.should.have.property('message')
		takeOrder2.data.message.should.equal('Order status is not ASSIGNING')

	})





	})
