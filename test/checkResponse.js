const axios = require('axios')
const config = require('./config')
const allAPIsFunctions = require('./allAPIsFunctions')
var chai = require('chai'),
expect = chai.expect,
should = chai.should;
chai.use(require('chai-json-schema'));
chaiHttp = require('chai-http')
var moment = require('moment')
moment().format();

var today = new Date()

let responseBody = []
let expectedStatusCode = 200
let expectedOrderStatus = 'ASSIGNING'

var takeOrderSuccessSchema = {
	title: 'Take Order success schema',
	type: 'object',
	required: ['id', 'status', 'ongoingTime'],
	properties: { 
		status: {
			type: 'string'
		},
		ongoingTime:{
			type:'string'
		}}}

var responseFailSchema = {
	title: 'Failed schema',
	type: 'object',
	required: ['message']
	}

var getOrderSuccessSchema = {
	title: 'Get Order detail success schema',
	type: 'object',
	required: ['id', 'stops', 'drivingDistancesInMeters', 'fare', 'status', 'orderDateTime', 'createdTime'],
	properties:{
		id: {
			type: 'number'
		},
		stops: {
			type: 'array'
		},
		drivingDistancesInMeters: {
			type: 'array'
		},
		fare: {
			type: 'object'
		},
		status: {
			type: 'string'
		},
		orderDateTime: {
			type: 'string'
		},
		createdTime: {
			type: 'string'
		}
	}
}

var completeOrderSchema = {
	title: 'Complete Order success schema',
	type: 'object',
	required: ['id', 'status', 'completedAt'],
	properties:{
		id:{
			type: 'number'
		},
		status:{
			type: 'string'
		},
		completedAt:{
			type: 'string'
		}
	}
}

var cancelOrderSchema ={
	title: 'Cancel Order success schema',
	type: 'object',
	required: ['id', 'status', 'cancelledAt'],
	properties:{
		id:{
			type: 'number'
		},
		status:{
			type: 'string'
		},
		cancelledAt:{
			type: 'string'
		}
	}
}


module.exports = {

	checkTakeOrderResponse: function (responseBody, expectedStatusCode, expectedOrderStatus){
			if(responseBody.status === 200){
				responseBody.status.should.equal(expectedStatusCode)
				expect(responseBody.data).to.be.jsonSchema(takeOrderSuccessSchema)

			}
			else if(responseBody.status === 422)
			{
				responseBody.status.should.equal(expectedStatusCode)
				expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
				responseBody.data.message.should.equal('Order status is not ASSIGNING')
			}
			else if(responseBody.status === 404)
			{	
				responseBody.status.should.equal(expectedStatusCode)
				expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
				responseBody.data.message.should.equal('ORDER_NOT_FOUND')
			}
			else{
				console.log('invalid')
			}
		},

	checkGetOrderDetail: function (responseBody, expectedStatusCode, orderId, expectedOrderStatus){
		if(responseBody.status === 200){
			responseBody.status.should.equal(expectedStatusCode)
			expect(responseBody.data).to.be.jsonSchema(getOrderSuccessSchema)
			responseBody.data.status.should.equal(expectedOrderStatus)
		}
		else if(responseBody.status === 404)
			{	
				responseBody.status.should.equal(expectedStatusCode)
				expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
				responseBody.data.message.should.equal('ORDER_NOT_FOUND')
			}
		else{
			console.log('invalid')
		}
	},
	checkCompleteOrder: function(responseBody, orderId, expectedStatusCode, expectedOrderStatus){
		if(responseBody.status === 200){
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.status.should.equal(expectedOrderStatus)
			expect(responseBody.data).to.be.jsonSchema(completeOrderSchema)
			responseBody.data.id.should.equal(orderId)

		}
		else if(responseBody.status === 422)
		{
			responseBody.status.should.equal(expectedStatusCode)
			expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
			responseBody.data.message.should.equal('Order status is not ONGOING')
		}
		else if(responseBody.status === 404)
		{	
			responseBody.status.should.equal(expectedStatusCode)
			expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
			responseBody.data.message.should.equal('ORDER_NOT_FOUND')
		}
		else{
			console.log('invalid')
		}

	},
	checkCancelledOrder: function(responseBody, orderId, expectedStatusCode, expectedOrderStatus){
		if(responseBody.status === 200){
			responseBody.status.should.equal(expectedStatusCode)
			responseBody.data.status.should.equal(expectedOrderStatus)
			expect(responseBody.data).to.be.jsonSchema(cancelOrderSchema)
			responseBody.data.id.should.equal(orderId)

		}
		else if(responseBody.status === 422)
		{
			responseBody.status.should.equal(expectedStatusCode)
			expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
			responseBody.data.message.should.equal('Order status is COMPLETED already')
		}
		else if(responseBody.status === 404)
		{	
			responseBody.status.should.equal(expectedStatusCode)
			expect(responseBody.data).to.be.jsonSchema(responseFailSchema)
			responseBody.data.message.should.equal('ORDER_NOT_FOUND')
		}
		else{
			console.log('invalid')
		}

	}

}
