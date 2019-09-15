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
        it('1) should return HTTP 201 and create new order successfully for normal flow.', async function() {
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
            calculationFunctions.checkPlaceOrderResponse(response, 201, '', null)            
        })

    //case 2: Place order with 2 locations
        it('2) should return HTTP 201 with sending valid 2 locations as input to API.', async function(){
            let stops =  [
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.375384, "lng": 114.182446
                }]
            let response = await allAPIsFunctions.placeOrder(stops)
            calculationFunctions.checkPlaceOrderResponse(response, 201, '', null)
        })   

    //case 3: Place order with more than 3 locations
        it('3) should return HTTP 201 with sending more than 3 valid locations as input to API.', async function() {
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
            calculationFunctions.checkPlaceOrderResponse(response, 201, '', null)
        })

    //case 4: Place order with duplicate locations will return $20 as minimum fare.
        it('4) should return HTTP 201 with duplicate locations sent to API and return $20 as minimum fare.', async function() {
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
            calculationFunctions.checkPlaceOrderResponse(response, 201, '', null)
        })      

    //case 5: Place order with only 1 location sent
    	it('5) should return HTTP 400 because one location sent', async function(){
    		let stops = [
    			{
            		"lat": 22.344674, "lng": 114.124651
        		}
    		]
        	let response = await allAPIsFunctions.placeOrder(stops)
            calculationFunctions.checkPlaceOrderResponse(response, 400, 'error in field(s): stops', null)
    	})

    //case 6: Place order with invalid lat, lng
    	it('6) should return HTTP 400 because invalid lat, lng format.(Failed by intention because no message handled.)', async function() {
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
            calculationFunctions.checkPlaceOrderResponse(response, 400, 'Invalid locations', null)
            //Failed by intention because API returned message as empty string. Actually API should have error message to display.
        })

      //case 7: Place order with different country locations
        it('7) should return HTTP 503 because send locations are in different country locations', async function(){
            let stops = [
                {
                    "lat": 22.344674, "lng": 114.124651 //Hong Kong
                },
                {
                    "lat": 13.756331, "lng": 100.501762 //Bangkok, Thailand
                }
                ]
            let response = await allAPIsFunctions.placeOrder(stops)
            calculationFunctions.checkPlaceOrderResponse(response, 503, 'Service Unavailable', null)
           //Per response from Postman
            }
        )

}
)
