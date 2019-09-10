const axios = require('axios')
const config = require('./config')
const allAPIsFunctions = require('./allAPIsFunctions')
var chai = require('chai')
    , chaiHttp = require('chai-http')
var expect = require('expect')
var should = require('chai').should()

var moment = require('moment')

chai.use(chaiHttp)

var today = new Date()
console.log(today)
/*var testDate = moment(today).add(1, 'day')
console.log(testDate)*/


describe('/Post placeOrderUrl', function() {

	//case 1: Schedule order with future date
	it('1) Schedule order for next day', async function(){

		let orderAt = moment(today).add(1, 'day')
		//console.log(orderAt)
		let stops =  [
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
    	let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
    	console.log(response.status, response.statusText, response.data)
        response.status.should.equal(201)
        response.data.should.have.property('id')
        response.data.should.have.property('drivingDistancesInMeters')
        response.data.should.have.property('fare')
        response.data.fare.should.have.property('amount')
        response.data.fare.should.have.property('currency')
	})

	//case 2: Schedule order with future time
	it('2) Schedule order for next hour', async function(){

		let orderAt = moment(today).add(1, 'hour')
		//console.log(orderAt)
		let stops =  [
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
    	let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
    	console.log(response.status, response.statusText, response.data)
        response.status.should.equal(201)
        response.data.should.have.property('id')
        response.data.should.have.property('drivingDistancesInMeters')
        response.data.should.have.property('fare')
        response.data.fare.should.have.property('amount')
        response.data.fare.should.have.property('currency')
	})

	//case 3: Schedule order with current date time
	it('3) Schedule order current date time', async function(){

		let orderAt = new Date()
		console.log(orderAt)
		let stops =  [
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
    	let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
    	response.status.should.equal(400)
    	response.data.should.have.property('message')
    	response.data.message.should.equal('field orderAt is behind the present time')
        
	})

	//case 4: Schedule order but orderAt is null
	it('4) Schedule order but orderAt is null.', async function(){

		let orderAt = null
		let stops =  [
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
    	let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        response.status.should.equal(201)
        response.data.should.have.property('id')
        response.data.should.have.property('drivingDistancesInMeters')
        response.data.should.have.property('fare')
        response.data.fare.should.have.property('amount')
        response.data.fare.should.have.property('currency')
	})

	//case 5: Schedule order but orderAt is empty string
	it('5) Schedule order but orderAt is empty string', async function(){
		let orderAt = ''
		let stops =  [
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
    	let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
    	console.log(response.status, response.statusText, response.data)
    	response.status.should.equal(400)
    	response.data.should.have.property('message')
    	response.data.message.should.equal('field orderAt is empty')
    	//Failed by intention because API returned message as empty string. Actually API should have error message to display.
	})



})





//case 8: Check price with in 2 km during 5:00:01 am - 9:59:59 pm, 2 stops
//case 9: Check price more than 2 km during 5:00:01 am - 9:59:59 pm, 2 stops
//case 10: Check price with in 2 km during 10:00:00 pm - 5:00:00 am, 2 stops
//case 11: Check price more than 2 km during 10:00:00 pm - 5:00:00 am, 2 stops
//case 8: Check price with in 2 km during 5:00:01 am - 9:59:59 pm, 3 stops
//case 9: Check price more than 2 km during 5:00:01 am - 9:59:59 pm, 3 stops
//case 10: Check price with in 2 km during 10:00:00 pm - 5:00:00 am, 3 stops
//case 11: Check price more than 2 km during 10:00:00 pm - 5:00:00 am, 3 stops


