const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Todo API", () => {
  /**
   * Test the GET route
   */
  describe("GET /todos", () => {
    it("should GET all the todos", (done) => {
      chai
        .request(app)
        .get("/todos")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
    it("should return a 404", (done) => {
      chai
        .request(app)
        .get("/todoss")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
});
