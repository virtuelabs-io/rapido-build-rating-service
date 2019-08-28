'use strict';

const mysql = require('serverless-mysql')({
    config: {
        host: process.env.HOST,
        user: process.env.USERNAME,
        port: process.env.PORT,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
})

module.exports.fun = async (event, context, callback) => {
    global.fetch = require('node-fetch');
    console.log(event)
    let customer_id = event.cognitoPoolClaims.sub
    let eventData = event.body;
    let canRateQuery = `
        CALL orders.check_product_purchase(UUID_TO_BIN(?),?);
    `;
    let canRate = false;
    console.log("Running canRateQuery", canRateQuery);
    let res = await mysql.query(canRateQuery, [ customer_id, eventData.product_id ])
    if(res[0]){
         canRate = res[0].length > 0 ? true : false;
    }

    let result = {}

    if(canRate){

        let insertQuery = `
            CALL ratings.create_rating(UUID_TO_BIN(?),?,?,?,?);
        `;
        console.log("Running insertQuery", insertQuery);
        result = await mysql.query(insertQuery, [
            customer_id,
            eventData.product_id,
            eventData.title,
            eventData.rating,
            eventData.summary
        ])

    } else {
        context.done('error', {
            "message": "Sorry! You are not authorized to comment on this product!",
            "status": 403
        })
    }
    await mysql.end()
    return result
}
