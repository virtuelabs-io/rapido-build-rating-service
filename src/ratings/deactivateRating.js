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
    let feedback_id = Number(event.path.id)
    let query = `
        UPDATE ratings.feedback
        SET active = FALSE
        WHERE id = ?;
    `;
    console.log("Running query", query);
    let results = await mysql.query(query, [
        feedback_id
    ])
    await mysql.end()
    return results
}
