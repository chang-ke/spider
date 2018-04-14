const qs = require('qs');
const fs = require('fs');
const Riven = require('./util/riven');
const cheerio = require('cheerio');

function isLogin() {
  return !!require('./user.json').cookie;
}

async function login(request) {
  let data = await request.create({
    url: 'https://juejin.im/auth/type/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: '', password: ''})
  });
  const cookie = data.headers['set-cookie'];
  const encodeToken = cookie[0]
    .split(';')[0]
    .split('=')[1];
  const decodeToken = JSON.parse(new Buffer(encodeToken, 'base64').toString())
  fs.writeFileSync('./user.json', JSON.stringify({cookie, token: decodeToken.token, userId: decodeToken.userId, clientId: decodeToken.clientId}));
}

async function getTopics(request) {
  const {token, clientId, userId} = require('./user.json');
  const querystring = qs.stringify({
    src: 'web',
    uid: userId,
    device_id: clientId,
    token: token,
    limit: 20,
    category: 'all',
    recomment: 1
  });
  const data = await request.get({
    url: `https://timeline-merger-ms.juejin.im/v1/get_entry_by_timeline?${querystring}`,
    headers: {
      host: 'timeline-merger-ms.juejin.im',
      referer: 'https://juejin.im/timeline?sort=comment'
    }
  });
  const body = data.body
  if (body.s !== 1) {
    fs.writeFileSync('./user.json', JSON.stringify({}))
    throw new Error(body.m);
  } else {
    return body.d.entrylist;
  }
}

try {
  (async function () {
    const request = new Riven();
    request.setDefaultOptions({
      headers: {
        Cookie: 'gr_user_id=44868117-2a80-49e8-ba2b-2acd2a77a887; ab={}; _ga=GA1.2.1234597644.150' +
            '6904166; MEIQIA_EXTRA_TRACK_ID=0uMtBISQ3EoiMICJMjpaZedfTBz; _gid=GA1.2.100579701' +
            '2.1523672771; Hm_lvt_93bbd335a208870aa1f296bcd6842e5e=1521573516,1521573752,1522' +
            '270605,1523672771; gr_session_id_89669d96c88aefbc=d54a635e-cece-4f16-aca4-808ae9' +
            '2ee559; gr_cs1_d54a635e-cece-4f16-aca4-808ae92ee559=objectId%3A5a974f6ef265da4e8' +
            '53d8d52; auth=; auth.sig=25Jg_aucc6SpX1VH8RlCoh6azLU; Hm_lpvt_93bbd335a208870aa1' +
            'f296bcd6842e5e=1523675329; QINGCLOUDELB=165e4274d6090771b096025ed82d52a1ab7e48fb' +
            '3972913efd95d72fe838c4fb|WtFwy|WtFwr'
      }
    }); //设不设置cookie都OK的
    if (!isLogin()) {
      login(request);
    }
    const topics = await getTopics(request);
    for (let i = 0; i < topics.length; ++i) {
      (async function () {
        let data = await request.get({url: topics[i].originalUrl});
      })();
    }
  })();
} catch (error) {
  console.log(error);
}
