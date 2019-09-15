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

describe('/Post placeOrderUrl', function() {

	//case 1: Place order successfully	
        it('1) return 201, created and body', async function() {
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
        	let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                calculationFunctions.checkResponse201(response, 201)
                calculationFunctions.checkDistanceAndPrice(response)             
            }
            else{
                calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
            }
        })

    //case 2: Place order with 2 locations
        it('2) return 201 with 2 locations', async function(){
            let stops =  [
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.375384, "lng": 114.182446
                }]
            let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                calculationFunctions.checkResponse201(response, 201)
                calculationFunctions.checkDistanceAndPrice(response)             
            }
            else{
                calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
            }
        })   

    //case 3: Place order with more than 3 locations
        it('3) return 201 with more than 3 locations', async function() {
            let stops =  [
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.375384, "lng": 114.182446
                },
                {
                    "lat": 22.385669, "lng": 114.186962
                },
                {
                    "lat": 22.379534, "lng": 114.267597
                }
            ]
            let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                calculationFunctions.checkResponse201(response, 201)
                calculationFunctions.checkDistanceAndPrice(response)             
            }
            else{
                calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
            }
        })

    //case 4: Place order with duplicate locations will return $20 as minimum fare.
        it('4) Place order with duplicate locations will return $20 as minimum fare.', async function() {
            let stops =  [
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.344674, "lng": 114.124651
                }
            ]
            let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                calculationFunctions.checkResponse201(response, 201)
                calculationFunctions.checkDistanceAndPrice(response)             
            }
            else{
                calculationFunctions.checkOtherResponse(response, 400, 'Invalid')
            }
        })      

    //case 5: Place order with only 1 location sent
    	it('5) return 400 because one location sent', async function(){
    		let stops = [
    			{
            		"lat": 22.344674, "lng": 114.124651
        		}
    		]
        	let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                    calculationFunctions.checkResponse201(response, 201)
                    calculationFunctions.checkDistanceAndPrice(response)             
                }
            else{
                    calculationFunctions.checkOtherResponse(response, 400, 'error in field(s): stops')
                }
    	})

    //case 6: Place order with invalid lat, lng
    	it('6) return 400 because invalid lat, lng', async function() {
        	let stops =  [
        		{
            		"lat": 'abc', "lng": 'def'
        		},
        		{
            		"lat": 'ghi', "lng": 'jkl'
        		},
        		{
            		"lat": 'mno', "lng": 'pqr'
        		}
    		]
            let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                    calculationFunctions.checkResponse201(response, 201)
                    calculationFunctions.checkDistanceAndPrice(response)             
                }
            else{
                    calculationFunctions.checkOtherResponse(response, 400, 'Invalid locations')
                }
            //Failed by intention because API returned message as empty string. Actually API should have error message to display.
        })

      //case 7: Place order with different country locations
        it('7) Place order with different country locations', async function(){
            let stops = [
                {
                    "lat": 22.344674, "lng": 114.124651 //Hong Kong
                },
                {
                    "lat": 13.756331, "lng": 100.501762 //Bangkok, Thailand
                }
                ]
            let response = await allAPIsFunctions.placeOrder(stops)
            if (response.status === 201){
                    calculationFunctions.checkResponse201(response, 201)
                    calculationFunctions.checkDistanceAndPrice(response)             
                }
            else{
                    calculationFunctions.checkOtherResponse(response, 503, 'Service Unavailable')    //Per response from Postman
                }
        })

}
)
