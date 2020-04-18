const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../index");
const expect = chai.expect;
const User = require('../models').User

chai.use(chaiHttp);

describe("routes", () => {
  after(() => {
    User.destroy({
      where: {},
      truncate: true
    })
    server.close();
  });

  it("GET /ping returns 'pong' response", done => {
    chai
      .request(server)
      .get("/ping")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).equal("pong");
        done();
      });
  });

  it("POST /users returns validation error response if name param is missing", done => {
    chai
      .request(server)
      .post("/users")
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json
        const resp = JSON.parse(res.text)
        expect(resp.body.name).equal("ValidationError")
        expect(resp.body.details[0].message).equal("\"name\" is required")
        done();
      });
  });

  it("POST /users returns validation error response if email param is missing", done => {
    chai
      .request(server)
      .post("/users")
      .set('Content-Type', 'application/json')
      .send({ name: "Darth Vader" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json
        const resp = JSON.parse(res.text)
        expect(resp.body.name).equal("ValidationError")
        expect(resp.body.details[0].message).equal("\"email\" is required")
        done();
      });
  });

  it("POST /users returns validation error response if email param is incorrect", done => {
    chai
      .request(server)
      .post("/users")
      .set('Content-Type', 'application/json')
      .send({ name: 'Darth Vader', email: 'incorrect email' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json
        const resp = JSON.parse(res.text)
        expect(resp.body.name).equal("ValidationError")
        expect(resp.body.details[0].message).equal("\"email\" must be a valid email")
        done();
      });
  });

  it("POST /users creates a new user record in the databvase and return a new created user", done => {
    chai
      .request(server)
      .post("/users")
      .set('Content-Type', 'application/json')
      .send({ name: 'Darth Vader', email: 'darth@deathstar.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json
        const resp = JSON.parse(res.text)
        expect(resp.name).equal("Darth Vader")
        expect(resp.email).equal("darth@deathstar.com")
        User.findAll().then((users) => {
          expect(users[0].toJSON().id).equal(resp.id)
        });
        done();
      });
  });
});