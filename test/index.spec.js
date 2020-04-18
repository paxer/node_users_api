const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../index");
const expect = chai.expect;
const User = require('../models').User

chai.use(chaiHttp);

describe("routes", () => {
  afterEach(() => {
    User.destroy({
      where: {},
      truncate: true
    })
  })

  after(() => {
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

  it("GET /users/:id returns a user record json found in the db", done => {
    User.create({ user: 'Luke Skywalker', email: 'luke@deathstar.net' }).then(user => {
      user = user.toJSON();
      chai
        .request(server)
        .get(`/users/${user.id}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json
          const resp = JSON.parse(res.text)
          expect(resp.name).equal(user.name)
          expect(resp.email).equal(user.email)
          done();
        });
    })
  });

  it("GET /users/:id returns 404 if user not found", done => {
    chai
      .request(server)
      .get(`/users/875223`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json
        expect(res.text).equal('{}')
        done();
      });
  });

  it("DELETE /users/:id returns 404 if user not found", done => {
    chai
      .request(server)
      .delete(`/users/123`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json
        expect(res.text).equal('{}')
        done();
      });
  });

  it("DELETE /users/:id deletes a user record from the database ", done => {
    User.create({ user: 'Luke Skywalker', email: 'luke@deathstar.net' }).then(user => {
      user = user.toJSON();
      chai
        .request(server)
        .delete(`/users/${user.id}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json
          expect(res.text).equal('{}')
          User.findByPk(user.id).then((user) => {
            expect(user).equal(null)
          })
          done();
        });
    })
  });

  it("PATCH /users/:id updates a user record details", done => {
    User.create({ user: 'Luke Skywalker', email: 'luke@deathstar.net' }).then(user => {
      user = user.toJSON();
      chai
        .request(server)
        .patch(`/users/${user.id}`)
        .send({ name: 'Darth Vader', email: 'darth@deathstar.net' })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json
          const resp = JSON.parse(res.text)
          expect(resp.name).equal('Darth Vader')
          expect(resp.email).equal('darth@deathstar.net')
          User.findByPk(user.id).then((user) => {
            expect(user.name).equal('Darth Vader')
            expect(user.email).equal('darth@deathstar.net')
          })
          done();
        });
    })
  });

  it("PATCH /users/:id returns 404 if user not found", done => {
    chai
      .request(server)
      .patch(`/users/123`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json
        expect(res.text).equal('{}')
        done();
      });
  });

  it("GET /users returns all users records", done => {
    User.create({ user: 'Luke Skywalker', email: 'luke@deathstar.net' }).then(user => {
      user = user.toJSON();
      chai
        .request(server)
        .get(`/users`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json
          const resp = JSON.parse(res.text)
          expect(resp[0].name).equal(user.name)
          expect(resp[0].email).equal(user.email)
          done();
        });
    })
  });
});