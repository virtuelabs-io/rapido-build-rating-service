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
    let feedback_id = Number(event.path.id)
    let query = `
        SELECT id,
               product_id,
               title,
               rating,
               summary,
               helpful
            FROM ratings.feedback
            WHERE id = ?
            AND customer_id = UUID_TO_BIN(?)
            AND active = TRUE;
    `;
    console.log("Running query", query);
    let results = await mysql.query(query, [
        feedback_id,
        customer_id
    ])
    await mysql.end()
    return results[0]
}
