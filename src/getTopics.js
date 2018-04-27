const fs = require('fs');
const qs = require('qs');
/**
 * 
 * 
 * @param {object} request 
 * @param {string} entryKey 
 * @param {number} limit 
 * @returns {array} entrylist
 */
async function getTopics(request, entryKey, limit) {
  const { token, clientId, userId } = require('./user.json');
  const querystring = qs.stringify({
    src: 'web',
    uid: userId,
    device_id: clientId,
    token: token,
    limit: limit || 20,
    category: 'all',
    recomment: 1
  });
  const entrys = {
    timeline: 'get_entry_by_timeline',
    comment: 'get_entry_by_comment',
    rank: 'get_entry_by_rank'
  };
  const data = await request.get({
    url: `https://timeline-merger-ms.juejin.im/v1/${entrys[entryKey]}?${querystring}`,
    headers: {
      host: 'timeline-merger-ms.juejin.im',
      referer: 'https://juejin.im/timeline?sort=comment'
    }
  });
  const body = data.body;
  if (body.s !== 1) {
    fs.writeFileSync('./user.json', JSON.stringify({}));
    throw { type: 'token', message: body.m };
  } else {
    return body.d.entrylist;
  }
}

module.exports = getTopics