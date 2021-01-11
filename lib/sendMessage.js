var request = require('request');

exports.send = function(req, messages) {
  var url = 'https://api.line.me/v2/bot/message/reply'
  var proxy = process.env.FIXIE_URL
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}',
  };
  var body = {
    'replyToken': req.body['events'][0]['replyToken'],
    'messages': messages
  };
  var json = true
  var options = {
    url,
    proxy,
    headers,
    json,
    body
  };

  request.post(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('リクエスト成功');
    } else {
      console.log('エラー: ' + JSON.stringify(response));
    }
  });
}
