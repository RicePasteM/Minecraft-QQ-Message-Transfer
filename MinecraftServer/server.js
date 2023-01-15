var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9000 });
const exec = require('child_process').exec

let clients = [];
let i = 0;

wss.on('connection', function (ws) {
    ws.name = ++i;
    clients.push(ws);
console.log('客户端上线');

    ws.on('message', function (msg) {
        console.log(msg.toString("utf-8"));
        process.stdin.write(msg.toString("utf-8"));
    })

    ws.on('close', function () {
        console.log('客户端下线');
    })
})

//广播信息
function broadcast(msg) {
    for (var key in clients) {
        clients[key].send(msg)
    }
}

// 这里输入服务端的启动脚本，服务端为原版端或其他与原版端保持相似控制台特性的服务端。
const process = exec('java -Xmx12G -jar -Xss1G -XX:+UseCompressedOops fabric-server-launch.jar nogui')
process.stdout.on('data', data => {
    broadcast(data);
    console.log(data);
})

