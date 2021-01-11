var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require("crypto");
var async = require('async');

var sendMessage = require('./lib/sendMessage.js');
var messageTemplate = require('./lib/messageTemplate.js');

// utilモジュールを使います。
var util = require('util');

app.set('port', (process.env.PORT || 8000));
// JSONの送信を許可
app.use(bodyParser.urlencoded({
  extended: true
}));
// JSONパーサー
app.use(bodyParser.json());

// herokuのTOPページに表示されるコンテンツを指定する
app.get('/', function(req, res) {
  res.send('<h1>hello world</h1>');
});

// async.waterfall([function(){}], function(){})
app.post('/callback', function(req, res) {
  async.waterfall(
    [
      function(callback) {
        // リクエストがLINE Platformから送られてきたか確認する
        if (!validate_signature(req.headers['x-line-signature'], req.body)) {
          return;
        }

        // テキストか画像が送られてきた場合のみ返事をする
        if (!isValidDataType(req)) {
          return;
        }

        // LINE Platformから送られてきたデータからユーザIDを取得する
        var eventData = req.body['events'][0];
        var user_id = eventData['source']['userId'];
        var message_id = eventData['message']['id'];
        // 'text', 'image' ...
        var message_type = eventData['message']['type'];
        var message_text = eventData['message']['text'];

        // ユーザー以外から届いたデータは無視する
        if (eventData['source']['type'] !== 'user') return 

        // ユーザー情報取得
        request.get(getProfileOption(user_id), function(error, response, body) {
          if (!error && response.statusCode == 200) {
            // 次のメソッドを呼ぶ
            callback(req, body['displayName'], message_id, message_type, message_text);
          }
        });
      },
    ],

    function(req, displayName, message_id, message_type, message_text) {
      const replyMessages = []
      var message = "hello, " + displayName + "さん"; // helloと返事する
      
      //var message = message_text; // おうむ返しする
      //var message = message_text + "[" + message_text.length + "文字]";
      replyMessages.push(messageTemplate.textMessage(message))
      
      ///////////////////
      // 画像で返事をする //
      ///////////////////
      
      // var messages = ["左上を押した", "右上を押した", "左下を押した", "右下を押した"];
      // if (message_text == "猫") {
      //    replyMessages.push(messageTemplate.imagemapMessage(messages, 'https://i.imgur.com/8cbL5dl.jpg'));
      // } else if (message_text == "犬") {
      //    replyMessages.push(messageTemplate.imagemapMessage(messages, 'https://i.imgur.com/ph82KWH.jpg'));
      // } else if (message_text == "鹿") {
      //    replyMessages.push(messageTemplate.imagemapMessage(messages, 'https://i.imgur.com/Z6ilhSI.jpg'));
      // }

      sendMessage.send(req, replyMessages);
      return;
    }
  );
});

app.listen(app.get('port'), function() {
  console.log('Node app is running');
});

// 送られてきたメッセージタイプをbotの内容に合わせる
// 一致すればtrueを返す
function isValidDataType(req) {
  var eventType = req.body['events'][0];
  var messageType = eventType['message']['type'];

  if (eventType['type'] != 'message') {
    return false; // メッセージではない
  }
  if (messageType != 'text' && messageType != 'image') {
    return false; // テキストでも画像でもない
  }
  return true; // valid
}

function getProfileOption(user_id) {
  return {
    url: 'https://api.line.me/v2/bot/profile/' + user_id,
    proxy: process.env.FIXIE_URL,
    json: true,
    headers: {
      'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}'
    }
  };
}

// 署名検証
function validate_signature(signature, body) {
  return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
}
