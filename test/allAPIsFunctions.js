const axios = require("axios")
const config = require("./config")
let orderId = 20
let scheduledTime = null
let orderStatus = 200
let locations =  [
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
const placeOrderUrl = config.APIList.baseURL + config.APIList.placeOrder
//let orderDetailsUrl = config.APIList.baseURL + config.APIList.orderDetails(orderId)
//let takeOrderUrl = config.APIList.baseURL + config.APIList.takeOrder(orderId)
//let completeOrderUrl= config.APIList.baseURL + config.APIList.completeOrder(orderId)
//let cancelOrderUrl = config.APIList.baseURL + config.APIList.cancelOrder(orderId)

module.exports = {
    //place order API
    placeOrder: async function (stops){
        let response = ''
        try{
            response = await axios.post(placeOrderUrl,{"stops": stops})
            return response
        }
        catch(error) {
            return error.response
        }
    },

    // Place Order with schedule time API
    scheduleOrder: async function (orderAt, stops){
            let response = ''
            try{
                response = await axios.post(placeOrderUrl, {"orderAt": orderAt, "stops": stops})
                return response
            }
            catch(error){
                return error.response
            }
    },

    // Get order details API
    getOrderDetails: async function (orderId){
        let orderDetailsUrl = config.APIList.baseURL + config.APIList.orderDetails(orderId)
        try{
            
            let response = await axios.get(orderDetailsUrl)
            //console.log(response)
            return response
        }
        catch(error){
            console.log(error.response.status)
            return error.reponse
        }
    },

    //Driver to take order API
    driverTakeOrder: async function (orderId){
        let takeOrderUrl = config.APIList.baseURL + config.APIList.takeOrder(orderId)
        try{
            console.log(takeOrderUrl)
            let response = await axios.put(takeOrderUrl)
            console.log(response.data)
            return response
        }
        catch(error){
            return error.response
        }
    },

    //Driver to complete order API
    driverCompleteOrder: async function (orderId){
        let completeOrderUrl= config.APIList.baseURL + config.APIList.completeOrder(orderId)
        try{
            let response = await axios.put(completeOrderUrl)
            console.log(response.data)
            return response
        }
        catch(error){
            return error.response
        }
    },
    //Cancel order API
    cancelOrder: async function (orderId){
        let cancelOrderUrl = config.APIList.baseURL + config.APIList.cancelOrder(orderId)
        try{
            let response = await axios.put(cancelOrderUrl)
            console.log(response.data)
            return response
        }
        catch(error){
            return error.response
        }

    }


}




