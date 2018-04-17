const fs = require('fs');
const qs = require('qs');
const config = require('../config')

async function login(request) {
  let data = await request.create({
    url: 'https://juejin.im/auth/type/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: config.email, password: config.password })
  });
  const cookie = data.headers['set-cookie'];
  const encodeToken = cookie[0].split(';')[0].split('=')[1];
  const decodeToken = JSON.parse(new Buffer(encodeToken, 'base64').toString());
  fs.writeFileSync(
    './user.json',
    JSON.stringify({ cookie, token: decodeToken.token, userId: decodeToken.userId, clientId: decodeToken.clientId })
  );
}
module.exports = login