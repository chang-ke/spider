const qs = require('qs');
/**
 * 
 * 
 * @param {object} request 
 * @param {string} id 
 */
async function getDetailData(request, id) {
  const { token, clientId, userId } = require('./user.json');
  const querystring = qs.stringify({
    uid: userId,
    device_id: clientId,
    token: token,
    src: 'web',
    type: 'entry',
    postId: id
  });
  const data = await request.get({
    url: `https://post-storage-api-ms.juejin.im/v1/getDetailData?${querystring}`,
    headers: {
      host: 'post-storage-api-ms.juejin.im',
      Origin: 'https://juejin.im',
      referer: `https://juejin.im/post/${id}`
    }
  });
  //console.log(data.body,data.headers);
  //console.log(data.body.content.match(/(https:\/\/user-gold-cdn).+?\/ignore-error\/1/g));
}

module.exports = getDetailData;
