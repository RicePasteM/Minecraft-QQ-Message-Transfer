var WebSocket = require('ws').WebSocket;
var ws = new WebSocket('ws://127.0.0.1:9000')

ws.onopen = function () {
    ws.send('tellraw @a {"text": "服务器-QQ群消息传输已启动，在服务器中发送以#开头的消息即可传输至QQ群，在QQ群中@机器人即可传输消息到服务器。", "color": "blue"}\n')
    console.log("已成功连接到服务器。")
}

ws.onclose = function () {
    console.log('Closed')
}

ws.onerror = function (err) {
    console.log(err);
}

module.exports = ws;