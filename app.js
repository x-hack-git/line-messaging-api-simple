var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var crypto = require("crypto");
var async = require("async");
var axios = require("axios");

var sendMessage = require("./lib/sendMessage.js");
var messageTemplate = require("./lib/messageTemplate.js");

// utilモジュールを使います。
var util = require("util");
const { cpuUsage } = require("process");

app.set("port", process.env.PORT || 8000);
// JSONの送信を許可
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// JSONパーサー
app.use(bodyParser.json());

// herokuのTOPページに表示されるコンテンツを指定する
app.get("/", function (req, res) {
  res.send("<h1>hello world</h1>");
});

// async.waterfall([function(){}], function(){})
app.post("/callback", function (req, res) {
  async.waterfall(
    [
      // エラーチェック
      function (callback) {
        // リクエストがLINE Platformから送られてきたか確認する
        if (!validate_signature(req.headers["x-line-signature"], req.body)) {
          return;
        }

        // テキストか画像が送られてきた場合のみ返事をする
        var eventType = req.body["events"][0];
        var messageType = eventType["message"]["type"];

        if (eventType["type"] != "message") {
          return; // メッセージではない
        }
        if (messageType != "text" && messageType != "image") {
          return; // テキストでも画像でもない
        }

        callback(null, req);
      },
      // ユーザーのプロフィール取得
      function (req, callback) {
        // LINE Platformから送られてきたデータからユーザIDを取得する
        var eventData = req.body["events"][0];
        var user_id = eventData["source"]["userId"];

        // ユーザー以外から届いたデータは無視する
        if (eventData["source"]["type"] !== "user") return;

        // ユーザー情報取得
        axios.get("https://api.line.me/v2/bot/profile/" + user_id, {
            proxy: process.env.FIXIE_URL,
            json: true,
            headers: {
              Authorization: `Bearer {${process.env.LINE_CHANNEL_ACCESS_TOKEN}}`,
            },
          })
          .then((res) => {
            callback(null, res.data, eventData);
          });
      },
      // 
      function (userProfile, eventData, callback) {
        const replyMessages = [];
        const message_id = eventData["message"]["id"];
        const message_type = eventData["message"]["type"];
        const message_text = eventData["message"]["text"];

        const message = `hello, ${userProfile.displayName}さん`; // 「hello, 〇〇さん」と返事する
        replyMessages.push(messageTemplate.textMessage(message));
        
        // if (message_text == "猫") {
        //   replyMessages.push(messageTemplate.imageMessage("https://i.imgur.com/8cbL5dl.jpg"));
        // } else if (message_text == "犬") {
        //   replyMessages.push(messageTemplate.imageMessage("https://i.imgur.com/ph82KWH.jpg"));
        // } else if (message_text == "鹿") {
        //   replyMessages.push(messageTemplate.imageMessage("https://i.imgur.com/Z6ilhSI.jpg"));
        // }

        sendMessage.send(req, replyMessages);
        callback(null, "done");
      },
    ],
    function (error) {
      console.log("all done.");
    }
  );
});

app.listen(app.get("port"), function () {
  console.log("Node app is running");
});

// 署名検証
function validate_signature(signature, body) {
  return (
    signature == crypto.createHmac("sha256", process.env.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), "utf8")).digest("base64")
  );
}
