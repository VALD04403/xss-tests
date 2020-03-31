const request = require('supertest');

const app = require('./index');
const agent = request.agent(app);

describe('app', () => {
  describe('when authenticated', () => {
    beforeEach(async () => {
      await agent
        .post('/login')
        .send('username=randombrandon&password=randompassword');
    });

    describe('POST /messages', () => {
      describe('with non-empty content', () => {
        describe('with JavaScript code in personalWebsiteURL', () => {
          it('responds with error', async done => {
            request(app)
              .post('/messages')
              .send(
                JSON.stringify({
                  content: 'john',
                  personalWebsiteURL: "javascript:alert('alert')"
                })
              )
              .set('Accept', 'application/x-www-form-urlencoded')
              .expect('Content-Type', /json/)
              .expect(400);
            done();
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success', async done => {
            request(app)
              .post('/messages')
              .send(
                JSON.stringify({
                  content: 'john',
                  personalWebsiteURL: 'https://helloworld.ru'
                })
              )
              .set('Accept', 'application/x-www-form-urlencoded')
              .expect('Content-Type', /json/)
              .expect(201);
            done();
          });
        });
      });
    });
  });
});
