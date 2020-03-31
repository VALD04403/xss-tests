const request = require('supertest');

const dataInterface = require('./data-interface');
const app = require('./index');
const agent = request.agent(app);

describe('app', () => {
  describe('when authenticated', () => {
    beforeEach(async () => {
      dataInterface.createMessage = jest.fn();
      await agent
        .post('/login')
        .send('username=randombrandon&password=randompassword');
    });

    describe('POST /messages', () => {
      describe('with non-empty content', () => {
        describe('with JavaScript code in personalWebsiteURL', () => {
          it('responds with error', async done => {
            await agent
              .post('/messages')
              .send('content=john&personalWebsiteURL=javascript:alert("alert")')
              .set('Accept', 'application/x-www-form-urlencoded')
              .expect('Content-Type', /json/)
              .expect(400);
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(0);
            done();
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success', async done => {
            await agent
              .post('/messages')
              .send('content=john&personalWebsiteURL=https://helloworld.ru')
              .set('Accept', 'application/x-www-form-urlencoded')
              .expect('Content-Type', /json/)
              .expect(201);
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(1);
            done();
          });
        });
      });
    });
  });
});
