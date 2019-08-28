const util = require("util");
const lambda = require("../../src/ratings/updateRating");
const handler = util.promisify(lambda.fun);

describe(`Testing: updateRating`, () => {
    beforeEach(() => {
        process.env.HOST = "localhost";
        process.env.PORT = "3306";
        process.env.DATABASE = "rapido";
        process.env.USERNAME = "root";
        process.env.PASSWORD = "admin";
    });

    test(`The handler exists`, () => {
      expect(handler).toBeTruthy();
    });
});
