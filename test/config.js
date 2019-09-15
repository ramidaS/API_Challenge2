var moment = require('moment');
var LintStream = require('jslint').LintStream;
module.exports = {

	APIList: {
		baseURL: 'http://localhost:51544',
		placeOrder: '/v1/orders',
		orderDetails:  (orderID) => `/v1/orders/${orderID}`,
		takeOrder: (orderID) => `/v1/orders/${orderID}/take`,
		completeOrder: (orderID) => `/v1/orders/${orderID}/complete`,
		cancelOrder: (orderID) => `/v1/orders/${orderID}/cancel`
	}
}
