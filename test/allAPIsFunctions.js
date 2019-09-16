const axios = require("axios");
const config = require("./config");

const placeOrderUrl = config.APIList.baseURL + config.APIList.placeOrder;

module.exports = {
    //place order API
    placeOrder: async function (stops){
        let response = ""
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
            let response = ""
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
            return response
        }
        catch(error){
            return error.response
        }
    },

    //Driver to take order API
    driverTakeOrder: async function (orderId){
        let takeOrderUrl = config.APIList.baseURL + config.APIList.takeOrder(orderId)
        try{
            let response = await axios.put(takeOrderUrl)
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
            return response
        }
        catch(error){
            return error.response
        }

    }


}




