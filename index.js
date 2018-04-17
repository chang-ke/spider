const fs = require('fs');
const qs = require('qs');
const cheerio = require('cheerio');
const Tiger = require('./util/tiger');
const login = require('./src/login');
const getTopics = require('./src/getTopics');
const getCategorys = require('./src/getCategorys');
const getDetailData = require('./src/getDetailData');

const isLogin = () => !!require('./src/user.json').cookie;

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

async function savePicture(request, url) {
  let data = await request.get({ url });
  const $ = cheerio.load(data.body);
  const img = $('.lazyload');
  const origin = request.default();
  for (let i = 0; i < img.length; ++i) {
    const url = img[i].src;
    console.log(img[i].prop('src'));
  }
  // let urls = data.body.match(/(https:\/\/user-gold-cdn).+?\/ignore-error\/1/g) || [];
  // if(fsExistsSync('./images')){
  //   fs.mkdirSync('./images')
  // }
  // for (let i = 0; i < urls.length; ++i) {
  //   const name = urls[i].match(/\/.{16}\?/g)[0].slice(1, -1);
  //   const f = fs.createWriteStream(`./images/${name}.png`);
  //   origin.get(urls[i]).pipe(f);
  // }
}

try {
  (async function() {
    const request = new Tiger();
    request.setDefaultOptions({
      //设不设置cookie都OK的
      headers: {
        Cookie:
          'gr_user_id=44868117-2a80-49e8-ba2b-2acd2a77a887; ab={}; _ga=GA1.2.1234597644.150' +
          '6904166; MEIQIA_EXTRA_TRACK_ID=0uMtBISQ3EoiMICJMjpaZedfTBz; _gid=GA1.2.100579701' +
          '2.1523672771; Hm_lvt_93bbd335a208870aa1f296bcd6842e5e=1521573516,1521573752,1522' +
          '270605,1523672771; gr_session_id_89669d96c88aefbc=d54a635e-cece-4f16-aca4-808ae9' +
          '2ee559; gr_cs1_d54a635e-cece-4f16-aca4-808ae92ee559=objectId%3A5a974f6ef265da4e8' +
          '53d8d52; auth=; auth.sig=25Jg_aucc6SpX1VH8RlCoh6azLU; Hm_lpvt_93bbd335a208870aa1' +
          'f296bcd6842e5e=1523675329; QINGCLOUDELB=165e4274d6090771b096025ed82d52a1ab7e48fb' +
          '3972913efd95d72fe838c4fb|WtFwy|WtFwr'
      }
    });
    if (!isLogin()) {
      login(request);
    }
    const topics = await getTopics(request, 'comment');
    for (let i = 0; i < topics.length; ++i) {
      //await getDetailData(request, topics[i].objectId);
      await savePicture(request, topics[i].originalUrl);
      await sleep(2000); //伪线程挂起
    }
  })();
  process.on('unhandledRejection', error => {
    if (error.type === 'token') {
      login();
    }
    console.log(error.message);
  });
} catch (error) {
  console.log(error.message);
}
