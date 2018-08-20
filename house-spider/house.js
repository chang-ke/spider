const request = require('request-promise'),
  cheerio = require('cheerio'),
  ua = require('random-ua');
const fs = require('fs');

let priceList = [];

async function main() {
  for (let k = 1; k < 20; k++) {
    let $ = await request({
      headers: { 'User-Agent': ua.generate() },
      uri: `https://hf.anjuke.com/sale/shushanqu/p${k}/?pi=baidu-cpc-hf-tyonghf1&kwid=1188204424&utm_term=%E5%90%88%E8%82%A5%E6%88%BF%E4%BB%B7#filtersort`,
      transform: body => cheerio.load(body),
    });
    let list = $('.pro-price');

    for (let i = 0; i < list.length; ++i) {
      priceList.push([
        list
          .eq(i)
          .find('strong')
          .eq(0)
          .text(),
        list
          .eq(i)
          .find('.unit-price')
          .eq(0)
          .text()
          .match(/^\d+/)[0],
      ]);
    }
  }
  fs.writeFileSync('./prices.json', JSON.stringify(priceList));
}

main();
