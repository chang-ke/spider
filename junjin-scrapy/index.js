const fs = require('fs');
const qs = require('qs');
const Segment = require('segment');
const cheerio = require('cheerio');
const Tiger = require('./utils/tiger');
const login = require('./src/login');
const getTopics = require('./src/getTopics');
const getCategorys = require('./src/getCategorys');
const getDetailData = require('./src/getDetailData');

const segment = new Segment();
segment.useDefault();
let map = new Map();

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
/**
 *
 *
 * @param {any} $ cheerio
 * @param {any} request 请求函数
 */
function saveImg($, request) {
  const img = $('.lazyload');
  const origin = request.getDefault();
  for (let i = 0; i < img.length; ++i) {
    //data.body.match(/(https:\/\/user-gold-cdn).+?\/ignore-error\/1/g)
    let src = img.eq(i).prop('data-src');
    let name = src.match(/\/.{16}\?/g) && src.match(/\/.{16}\?/g)[0].slice(1, -1);
    if (name) {
      origin.get(src).pipe(fs.createWriteStream(`./images/${name}.png`));
    }
  }
}

async function getPage(request, url) {
  const data = await request.get({ url });
  const $ = cheerio.load(data.body);
  saveImg($, request);
  //获取内容
  let length = $('p').length;
  for (let i = 0; i < length; ++i) {
    let result = segment.doSegment(
      $('p')
        .eq(i)
        .text(),
      {
        simple: true, //不输出词性
        stripPunctuation: true //去除标点符号
      }
    );
    result.forEach((item, key) => {
      map.set(item, map.get(item) + 1 || 1); //1 + undefined || 1 => 1
    });
  }
  map = sortToken(map);
}

function sortToken(map) {
  const words = {};
  let mapCopy = new Map(map);
  map.forEach((value, key) => {
    //分词长度大于1
    if (value !== 1 && key.length > 1) {
      words[key] = value;
    }
    if (value === 1) {
      mapCopy.delete(key);
    }
  });
  const keys = Object.keys(words);
  keys.sort((a, b) => {
    return words[b] - words[a];
  });
  //每篇文章词频最高的10个词
  keys.slice(0, 20).forEach(item => {
    console.log(item, words[item]);
  });
  //返回分词中词频为1的分词
  return mapCopy;
}

try {
  const request = new Tiger();
  //设不设置cookie都OK的
  request.setDefaultOptions({
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
  (async function() {
    if (!isLogin()) {
      login(request);
    }
    const entrys = ['timeline', 'comment', 'rank'];
    const topics = await getTopics(request, entrys[1], 100);
    for (let i = 0; i < topics.length; ++i) {
      //await getDetailData(request, topics[i].objectId);
      await getPage(request, topics[i].originalUrl);
      await sleep(2000); //伪线程挂起
    }
    map = sortToken(map);
    console.log(map);
  })();
  process.on('unhandledRejection', error => {
    if (error.type === 'words') {
      login();
    }
    console.log(error);
  });
} catch (error) {
  console.log(error);
}

