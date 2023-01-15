let query = require("./mstarMessage/sql");
let ws = require("./mstarMessage/socket");

const client = require("../index.js")

const { segment } = require("oicq")

let bot = client.bot;

let groupNumber = 000000000/*在此输入你的QQ群号*/;

let groupNickname = "@xxxxxx"/*在此输入机器人在群中的马甲，用于判断是否@了自己*/;

// 接收到信息时
ws.onmessage = function (event) {
    console.log(event.data.toString("utf-8"))
    let oicq_group = bot.pickGroup(groupNumber);
    let msg_ls = event.data.split(" ");
    if(msg_ls[1] == "[Server" && msg_ls[2] == "thread/INFO]:"){
        if(/<.*>/.test(msg_ls[3]) && msg_ls[4][0] == "#"){
            //表明是一个聊天消息
            let msg = msg_ls.splice(3).join(" ").replace("\n","").replace("\r","");
            oicq_group.sendMsg("[服务器] " + msg.replace("#",""));
        } else if(/.* joined the game/.test(event.data)){
            oicq_group.sendMsg("[服务器] " + msg_ls[3] + " 加入了服务器。");
        } else if(/.* left the game/.test(event.data)){
            oicq_group.sendMsg("[服务器] " + msg_ls[3] + " 离开了服务器。");
        }
    }
}

bot.on("message",async e => {
    if(e.message_type == "group" && e.group_id == groupNumber && e.self_id != e.sender.user_id){
        await handleGroupMsg(e);
    } else if(e.message_type == "private" && e.self_id != e.sender.user_id){
        await handlePrivateMsg(e);
    }
})

async function handleGroupMsg(e){
    //如果是@自己的消息，则进行响应，否则不做响应
    if(e.raw_message.indexOf(groupNickname) != -1){
        if(e.raw_message.replace(groupNickname,"").replace(" ","") == "帮助"){
            //处理“帮助”指令
            sendHelpList()
        } else if(e.raw_message.replace(groupNickname,"").replace(" ","") == "查看在线玩家"){
            //处理“查看在线玩家”指令
            sendOnlinePlayersList()
        } else {
            ws.send(`tellraw @a {"text": "[QQ群] <${e.sender.nickname}> ${e.raw_message.replace(groupNickname,"").replace(" ","")}", "color": "blue"}\n`);
        }
    }
}

async function handlePrivateMsg(e){

}

async function sendOnlinePlayersList(){
    let oicq_group = bot.pickGroup(groupNumber);
    let listStr = ["该功能已暂时被禁用。\n"];
    oicq_group.sendMsg(listStr);
}

async function sendHelpList(){
    let oicq_group = bot.pickGroup(groupNumber);
    let listStr = ["====指令列表====\n"];
    listStr.push("暂无可用指令");
    oicq_group.sendMsg(listStr);
}

function second2minite(seconds){
    return Math.ceil(seconds / 60);
}