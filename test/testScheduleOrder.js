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

var today = new Date()

describe('/Post placeOrderUrl WITH orderAt value', function() {

	it('1: Schedule order for next day', async function(){

		let orderAt = moment.utc(today).add(1, 'day')
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
    	if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
        }
	})

	
	it('2: Schedule order for next hour', async function(){

		let orderAt = moment.utc(today).add(1, 'hour')
        let convertTime = moment(orderAt).format()
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
    	if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
        }
	})

	
	it('3: Schedule order current date time. Expected 400', async function(){

		let orderAt = moment.utc(today)
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
    	if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is behind the present time')
        }
        
	})

	
	it('4: Schedule order but orderAt is null.', async function(){

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
       if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
        }
	})

	
	it('5: Schedule order but orderAt is empty string', async function(){
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
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }
    	//Failed by intention because API returned message as empty string. Actually API should have error message to display.
	})

    
    it('6: Check price more than 2 km during 5:00:00- 21:59:59, 2 stops.', async function(){
        let date = '2019-10-10T05:00:00.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // 1.5km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.278967, "lng": 114.183168
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }
    })

    it('7: check price with total distance = 2km during 5:00:00- 21:59:59', async function(){
        let date = '2019-10-10T21:00:00.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // 2km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.281631, "lng": 114.189580
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }
    })
    
    it('8: Check price with total distance > 2 km during 5:00:00- 21:59:59', async function(){
        let date = '2019-10-10T21:59:59.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // ~21km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.342844, "lng": 114.205826
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    } )

    it('9: check price more than 2 km during  5:00:00- 21:59:59, 3 stops.', async function(){
        let date = '2019-10-10T22:00:00.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               //total ~3.5km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.278967, "lng": 114.183168
                },
                {
                    "lat": 22.281631, "lng": 114.172160   
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    } )

    it('10: Check price with in 2 km during 22:00:00 - 4:59:59, 2 stops', async function(){
        let date = '2019-10-10T04:59:00.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // 1.5km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.278967, "lng": 114.183168
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    })

    it('11: Check price with total distance = 2 km during 22:00:00 - 4:59:59', async function(){
        let date = '2019-10-10T22:00:01.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // 2km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.281631, "lng": 114.189580
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    })

    it('12: Check price more than 2 km during 22:00:00 - 4:59:59, 2 stops', async function(){
        let date = '2019-10-10T04:59:59.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // ~21km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.342844, "lng": 114.205826
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    })

    it('13: Check price more than 2 km during 5:00:01 am - 9:59:59 pm, 3 stops ', async function(){
        let date = '2019-10-10T01:50:30.000Z'      
        let orderAt = moment.utc(date)
        let stops =  [                               // ~21km
                {
                    "lat": 22.276148, "lng": 114.172160
                },
                {
                    "lat": 22.278967, "lng": 114.183168
                },
                {
                    "lat": 22.281631, "lng": 114.172160   
                }
        ]
        let response = await allAPIsFunctions.scheduleOrder(orderAt,stops)
        if (response.status === 201){
            calculationFunctions.checkResponse201(response, 201)
            calculationFunctions.checkDistanceAndPrice(response, orderAt)             
        }
        else{
            calculationFunctions.checkOtherResponse(response, 400, 'field orderAt is empty')
        }

    })
})



