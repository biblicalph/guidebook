// import * as faker from 'faker';
// import { getDbConnection } from '../../src/mongodb';
// import mongoose from 'mongoose';

// const dbUrl = `mongodb://localhost/${faker.random.uuid()}`;

// describe.only('Mongodb Connector Spec', () => {
//   let dbConnection;

//   beforeEach(() => {
//     dbConnection = getDbConnection(dbUrl);
//   });

//   afterEach(done => {
//     dbConnection.on('disconnected', done);
//     dbConnection.disconnect();
//   });

//   afterAll(async () => {
//     await mongoose.connection.db.dropDatabase();
//   })

//   test('should connect to the database and emit "connected" event', done => {
//     dbConnection.on('connected', ({ name }) => {
//       expect(name).toBe('mongodb');
//       done();
//     });

//     dbConnection.connect();
//   });

//   test('should return true if database is connected', done => {
//     dbConnection.on('connected', () => {
//       expect(dbConnection.isConnected()).toBe(true);
//       done();
//     });

//     dbConnection.connect();
//   });

//   test('should emit "disconnected" event when database is disconnected', done => {
//     dbConnection
//       .on('connected', () => {
//         dbConnection.disconnect();
//       })
//       .on('disconnected', () => {
//         done();
//       });

//     dbConnection.connect();
//   });

//   test('should return false if database is disconnected', () => {
//     expect(dbConnection.isConnected()).toBe(false);
//   });
// });
