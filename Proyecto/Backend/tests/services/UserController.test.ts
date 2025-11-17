import { expect, should } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import { registerUser, loginUser } from "../../src/db_connection/controller/UserController";
import bcrypt from "bcryptjs";
import Database from "../../src/db_connection/db/Database";
import { create } from "domain";

describe("UserController Tests", () => {
    describe("registerUser", () => {

        //cuerpo del request falso
        const baseBody = {
            username: "juan",
            email: "juan@mail.com",
            name: "Juan",
            lastname: "Cortés",
            age: 21,
            password: "123",
            gender: "Male",
            description: "Soy un test"
        }

        const requiredFields = [
            "username",
            "email",
            "password",
            "name",
            "lastname",
            "age"
        ];

        let req: any;
        let res: any;
        let jsonStub: any;
        let statusStub: any;
        let fakeRepo: any;

        //Declarar los stubs
        let hashStub: sinon.SinonStub
        let findOneStub: sinon.SinonStub
        let saveStub: sinon.SinonStub
        let createStub: sinon.SinonStub

        //los prints
        let consoleLogStub: sinon.SinonStub;
        let consoleErrorStub: sinon.SinonStub;
        let consoleWarnStub: sinon.SinonStub;


        beforeEach(() => {
            req = {};
            jsonStub = sinon.stub();
            statusStub = sinon.stub().returns({ json: jsonStub });

            consoleLogStub = sinon.stub(console, "log");
            consoleErrorStub = sinon.stub(console, "error");
            consoleWarnStub = sinon.stub(console, "warn");

            res = {
                status: statusStub
            };

            fakeRepo = {
                findOne: sinon.stub(),
                save: sinon.stub(),
                create: sinon.stub()
            }

            sinon.stub(Database.getInstance(), "getRepository").returns(fakeRepo)

            findOneStub = fakeRepo.findOne;
            saveStub = fakeRepo.save;
            createStub = fakeRepo.create

            sinon.stub(bcrypt, "hash").resolves("hashed123");
        });

        afterEach(() => {
            sinon.restore();
        });

        it("should register user and return 201 with no missing fields", async () => {

            //cuerpo del request falso
            req.body = { ...baseBody};

            findOneStub.resolves(null);
            saveStub.resolves({ id:1 })

            await registerUser(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
        });

        it("Should register user and return 201 if 'description' is missig", async() => {

            //body base
            req.body = { ...baseBody};
            //quitar description
            delete req.body['description'];

            await registerUser(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
        })

        requiredFields.forEach((field) => {
            it(`should return 400 if '${field}' is missing`, async () => {
                // clonar body base
                req.body = { ...baseBody };

                // borrar SOLO ese campo
                delete req.body[field];

                await registerUser(req, res);

                expect(statusStub.calledWith(400)).to.be.true;

                const response = jsonStub.firstCall.args[0];
                expect(response.missing).to.include(field);
            });
        });

    });


    describe("loginUser", () => {

        let req: any;
        let res: any;
        let jsonStub: any;
        let statusStub: any;
        let fakeRepo: any;

        //Declarar los stubs
        let hashStub: sinon.SinonStub
        let findOneStub: sinon.SinonStub
        let saveStub: sinon.SinonStub
        let createStub: sinon.SinonStub

        //los prints
        let consoleLogStub: sinon.SinonStub;
        let consoleErrorStub: sinon.SinonStub;
        let consoleWarnStub: sinon.SinonStub;


        beforeEach(() => {
            req = {};
            jsonStub = sinon.stub();
            statusStub = sinon.stub().returns({ json: jsonStub });

            consoleLogStub = sinon.stub(console, "log");
            consoleErrorStub = sinon.stub(console, "error");
            consoleWarnStub = sinon.stub(console, "warn");

            res = {
                status: statusStub
            };

            fakeRepo = {
                findOne: sinon.stub(),
                save: sinon.stub(),
                create: sinon.stub()
            }

            sinon.stub(Database.getInstance(), "getRepository").returns(fakeRepo)

            findOneStub = fakeRepo.findOne;
            saveStub = fakeRepo.save;
            createStub = fakeRepo.create

            sinon.stub(bcrypt, "hash").resolves("hashed123");
        });

        afterEach(() => {
            sinon.restore();
        });

        it("should return 400 if 'email' is missing", async () => {
            const req: any = {
                body: {
                    password: "123"
                }
            };
            const jsonStub = sinon.stub();
            const statusStub = sinon.stub().returns({ json: jsonStub });
            const res: any = {
                status: statusStub
            };
            await loginUser(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            const response = jsonStub.firstCall.args[0];
            expect(response.message).to.equal("Missing required field: email");
        });

        it("should return 400 if 'password' is missing", async () => {
            const req: any = {
                body: {
                    email: "juan@perez.com"
                }
            };
            const jsonStub = sinon.stub();
            const statusStub = sinon.stub().returns({ json: jsonStub });
            const res: any = {
                status: statusStub
            };
            await loginUser(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            const response = jsonStub.firstCall.args[0];
            expect(response.message).to.equal("Missing required field: password");
        });

        it("should return 404 if user email not found", async () => {
            const req: any = {
                body: {
                    email: "pepe@perez.com",
                    password: "123"
                }
            };
            const jsonStub = sinon.stub();
            const statusStub = sinon.stub().returns({ json: jsonStub });
            const res: any = {
                status: statusStub
            };
            
            fakeRepo.findOne.resolves(null);

            await loginUser(req, res);
            
            expect(statusStub.calledWith(404)).to.be.true;

            const response = jsonStub.firstCall.args[0];
            expect(response.message).to.equal("Invalid email");
            
        });

        it("should return 401 if password is incorrect", async () => {
            const req: any = {
                body: {
                    email: "pepe@perez.com",
                    password: "123"
                }
            };
            const jsonStub = sinon.stub();
            const statusStub = sinon.stub().returns({ json: jsonStub });
            const res: any = {
                status: statusStub
            };
            
            sinon.stub(bcrypt, "compare").resolves(false);

            await loginUser(req, res);
            
            expect(statusStub.calledWith(404)).to.be.true;

            const response = jsonStub.firstCall.args[0];
            expect(response.message).to.equal("Invalid email");
        });

        it("should return 500 on internal server error", async () => {
            const req: any = {
                body: {
                    email: "pedro@pecas.com",
                    password: "123"
                }
            };
            const jsonStub = sinon.stub();
            const statusStub = sinon.stub().returns({ json: jsonStub });
            const res: any = {
                status: statusStub
            };
            fakeRepo.findOne.throws(new Error("DB error"));

            await loginUser(req, res);
            expect(statusStub.calledWith(500)).to.be.true;

            const response = jsonStub.firstCall.args[0];
            expect(response.message).to.equal("Internal server error");
        });
    })
});
