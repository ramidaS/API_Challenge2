const axios = require("axios")
const config = require("./config")
const allAPIsFunctions = require("./allAPIsFunctions")
var chai = require("chai")
  , chaiHttp = require("chai-http")
const should = require("should")
chai.use(chaiHttp)

describe('/Post placeOrderUrl', function() {
	//case 1: Place order successfully	
        it('return 201, created and body', async function() {
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
        	console.log(response.status, response.statusText, response.data)
        	response.status.should.equal(201)
        	response.data.should.have.properties('id', 'drivingDistancesInMeters', 'fare')
        	response.data.fare.should.have.properties('amount','currency')
        }
        )
    //case 2: Place order with 2 locations
        it('return 201 with 2 locations', async function(){
            let stops =  [
                {
                    "lat": 22.344674, "lng": 114.124651
                },
                {
                    "lat": 22.375384, "lng": 114.182446
                }]
            let response = await allAPIsFunctions.placeOrder(stops)
            console.log(response.status, response.statusText, response.data)
            response.status.should.equal(201)
            response.data.should.have.properties('id', 'drivingDistancesInMeters', 'fare')
            response.data.fare.should.have.properties('amount','currency')
        }
        )   

    //case 3: Place order with more than 3 locations
        it('return 201 with more than 3 locations', async function() {
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
            console.log(response.status, response.statusText, response.data)
            response.status.should.equal(201)
            response.data.should.have.properties('id', 'drivingDistancesInMeters', 'fare')
            response.data.fare.should.have.properties('amount','currency')
        }
        )
    //case 4: Place order with duplicate locations will return $20 as minimum fare.
        it('return warning because same locations for pick up and delivery', async function() {
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
            console.log(response.status, response.statusText, response.data)
            response.status.should.equal(201)
            response.data.should.have.properties('id', 'drivingDistancesInMeters', 'fare')
            response.data.fare.should.have.property('amount', '20.00')
            response.data.fare.should.have.property('currency','HKD')
        }
        )      

    //case 5: Place order with only 1 location sent
    	it('return 400 because one location sent', async function(){
    		let stops = [
    			{
            		"lat": 22.344674, "lng": 114.124651
        		}
    		]
    	let response = await allAPIsFunctions.placeOrder(stops)
        //expect(response.status).to.be.eq(400);
    	expect(res.statusCode).to.equal(400);
        //response.should.have.property('status', 400)
    	//response.data.should.have.property('message')
    	//response.data.message.should.equal('error in field(s): stops')
    	}
    )
    //case 6: Place order with invalid lat, lng
    	it('return 400 because invalid lat, lng', async function() {
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
        	console.log(response.status, response.statusText, response.data)
        	response.status.should.be.equal(400);
            //response.status.should.equal(400)
    		//response.data.should.have.properties('message')
    		//response.data.message.should.equal('error in field(s): stops')
        	
        }
        )
      
    
    //case 7: Place order with different country locations
}
)
