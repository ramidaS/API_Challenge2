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

module.exports = {

let timeStamp : moment(scheduledTime)
let standardDistance : 2000
let standardPriceDay : 20
let standardPriceNight : 30
let extraPriceDay : 5
let extraPriceNight : 8
let extraDistance : 0
let extraCharge : 0
let totalPrice : 0
let totalDistance : 0

priceCalculation: async function (){
    
    let response = await allAPIsFunctions.scheduleOrder(scheduledTime,locations)
	let distance = response.data.drivingDistancesInMeters
    console.log(distance)
    totalDistance = distance.reduce(function(a, b) { return a + b; }, 0)
    console.log(totalDistance)

    let timeStamp = moment(scheduledTime)
    console.log('time: ' + timeStamp)
    console.log('hour: ' + timeStamp.hour())
    if(timeStamp.hour() >= 5 && timeStamp.hour() <= 22)			//5am - 10pm
    	{
    		console.log('Day time')
    		extraDistance = totalDistance-standardDistance
    		console.log('extraDistance: ' + extraDistance)		
    		extraCharge = (extraDistance/200)*5
    		console.log('extraCharge: ' + extraCharge)
    		totalPrice = standardPriceDay + parseFloat(extraCharge.toFixed(2))
    		console.log('totalPrice: '+ totalPrice)
    	}
    	else if(timeStamp.hour() < 5 || (timeStamp.hour() > 22 && timeStamp.minute() > 0)){
    		extraDistance = totalDistance-standardDistance
    		console.log('extraDistance: ' + extraDistance)		
    		extraCharge = (extraDistance/200)*8
    		console.log('extraCharge: ' + extraCharge)
    		totalPrice = standardPriceNight + parseFloat(extraCharge.toFixed(2))
    		console.log('totalPrice: '+ totalPrice)
    	}
    	else{
    		console.log('Invalid Time or Invalid time format')
    	}
}
}
priceCalculation()



