const request = require('request-promise');
const fs = require('fs');

(async function() {
  let data = await request({
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    },
    uri: `https://hf.lianjia.com/fangjia/priceTrend/?region=city&region_id=340100`,
  });
  let str = '';
  JSON.parse(data).currentLevel.dealPrice.total.forEach((price, i) => {
    str += ((i + 6) % 12) + 1 + ',' + price + '\n';
  });
  fs.writeFileSync('./house_price.txt', str);
})();
