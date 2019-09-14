const axios = require("axios")
const config = require("./config")
const allAPIsFunctions = require('./allAPIsFunctions')
var moment = require('moment')
moment().format();


let scheduledTime = new Date("2019-09-12T15:10:18.061Z")
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

let response = allAPIsFunctions.scheduleOrder(scheduledTime,locations)

	function totalDistanceCalculation(distance){
	    
	    totalDistance = distance.reduce(function(a, b) { return a + b; }, 0)
	    console.log(totalDistance)

	    return totalDistance
	}

	function priceCalculation(totalDistance, timeStamp){
		let standardDistance = 2000
		let minPriceDay = 20
		let minPriceNight = 30
		let extraPriceDay = 5
		let extraPriceNight = 8
		let extraDistance = 0
		let extraCharge = 0
		let totalPrice = 0
	
	if(totalDistance > standardDistance){	

	    if(timeStamp.hour() >= 5 && timeStamp.hour() < 22)			//5am - 10pm
	    	{
	    		h = timeStamp.hour()
	    		console.log(h)
	    		console.log('Order time is during 5:00:00 am to 10:00:00 pm')
	    		extraDistance = totalDistance-standardDistance
	    		extraCharge = (extraDistance/200)*5
	    		totalPrice = minPriceDay + parseFloat(extraCharge.toFixed(2))
	    		totalPrice = totalPrice.toFixed(2)
	    	}
	    	else if(timeStamp.hour() < 5 || (timeStamp.hour() >= 22 && timeStamp.minute() >= 0 && timeStamp.seconds() >= 0)){		//22:01-04:59
	    		console.log('Order time is during 10.01:00 pm - 4:59:59 am')
	    		extraDistance = totalDistance-standardDistance
	    		extraCharge = (extraDistance/200)*8
	    		totalPrice = minPriceNight + parseFloat(extraCharge.toFixed(2))
	    		totalPrice = totalPrice.toFixed(2)
	    	}
	    	else{
	    		console.log('Invalid Time or Invalid time format')
	    	}}

	else if(totalDistance <= standardDistance){
		if(timeStamp.hour() >= 5 && timeStamp.hour() <= 22)	{
	    	totalPrice = minPriceDay.toFixed(2)
	    }
	    else if (timeStamp.hour() < 5 || (timeStamp.hour() > 22 && timeStamp.minute() >= 0 && timeStamp.seconds() > 0)) {
	    	totalPrice = minPriceNight.toFixed(2)	
	    }
	}

	else{
	    	console.log("Invalid distance")
	    }
	    return totalPrice

	    }


module.exports = {

	checkResponse201: function (responseBody, expectedStatus){
	    
	    responseBody.status.should.equal(expectedStatus)
	    responseBody.data.should.have.property('id')
	    responseBody.data.should.have.property('drivingDistancesInMeters')
	    responseBody.data.should.have.property('fare')
	    responseBody.data.fare.should.have.property('amount')
	    responseBody.data.fare.should.have.property('currency')
	    return
	},

	checkOtherResponse: function (responseBody, expectedStatus, errorMessage){
	    responseBody.status.should.equal(expectedStatus)
	    responseBody.data.should.have.property('message')
	    responseBody.data.message.should.equal(errorMessage)
	    return
	},

	checkDistanceAndPrice: function (responseBody, orderAt){
	    let drivingDistance = responseBody.data.drivingDistancesInMeters.reduce(function(a, b) { return a + b; }, 0)
	    let fareAmount = responseBody.data.fare.amount
	    let currency = responseBody.data.fare.currency
	    let timeStamp = 0
	    if (orderAt === null || orderAt === undefined){
	    	let responseTime = responseBody.headers.date
	    	timeStamp = moment.utc(responseTime)
	    	console.log('timeStamp: '+timeStamp)
	    	console.log('orderAt is null or undefined')
	    }else if(orderAt !== undefined){
	    	timeStamp = moment.utc(orderAt)
	    	console.log('timeStamp: '+timeStamp)
	    	console.log('valid orderAt')
	    }else{
	    	console.log('Invalid orderAt')
	    	//console.log('timeStamp: '+timeStamp)
	    	console.log(orderAt)
	    }
	    let distances = responseBody.data.drivingDistancesInMeters
	    let totalDistances = totalDistanceCalculation(distances)
	    let totalPrice = priceCalculation(totalDistance, timeStamp)
	    
	    currency.should.equal('HKD')
	    drivingDistance.should.equal(totalDistance)
	    fareAmount.should.equal(totalPrice)
	    console.log('totalDistance: '+totalDistance+' and totalPrice: '+totalPrice)
	    return totalPrice, totalDistance

	}

	}




