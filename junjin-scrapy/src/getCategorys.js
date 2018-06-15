async function getCategorys(request, params) {
  const { token, clientId, userId } = require('./user.json');
  const data = await request.get({
    url: 'https://gold-tag-ms.juejin.im/v1/categories',
    headers: {
      Host: 'gold-tag-ms.juejin.im',
      Origin: 'https://juejin.im',
      Referer: 'https://juejin.im/timeline/freebie',
      'X-Juejin-Client': clientId,
      'X-Juejin-Src': 'web',
      'X-Juejin-Token': token,
      'X-Juejin-Uid': userId
    }
  });
}

module.exports = getCategorys;
