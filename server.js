const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser'); //中间件
const io = require('socket.io')(server);
let mySocket = {};

//mongodb数据库操作
const mongodb = require('mongodb');
const serverdb = new mongodb.Server('localhost',27017,{auto_reconnect:true});
const db = new mongodb.Db('nodetest',serverdb,{safe:true});
let sensordata; //表

//serialport串口操作
let serialPort = require('serialport');
let port = {};
let portsName = [];

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));// for parsing application/json
app.use(bodyParser.json()); // for parsing application/x-www-form-urlencoded

//根目录
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/build/index.html');
});

server.listen(80,function(){
    console.log('listening on *:80');
});

serialPort.list(function (err, ports) {
    // console.log(ports);
    ports.forEach(function(port) {
        portsName.push(port.comName);
    });
});

//API
app.get('/portsName',function(req,res){
    res.send(portsName);
});
app.post('/connect',function(req,res){
    console.log(req.body);
    const config = req.body;
    port = new serialPort(config.COM,{
        baudRate:parseInt(config.baudRate),
        dataBits:parseInt(config.dataBits),
        parity:config.parity,
        stopBits:parseFloat(config.stopBits),
        flowControl:config.flowControl,
    });

    io.on('connect',function(socket){
        mySocket = socket;
        port.on('open',function () {
            console.log('port open');
            let bufs = [];
            port.on('data',function (data) {
                bufs.push(data);
                let bufRecv = Buffer.concat(bufs);
                let _document = {}; //json
                //协议解析
                if(bufRecv.length>=5){
                    if(bufRecv[0]===0xCC && bufRecv[1]===0xDD){
                        let key = bufRecv[2].toString(16); //ID
                        // console.log(key);
                        let len = bufRecv[3];//数据长度
                        // console.log(len);
                        if(bufRecv.length>=len+7){
                            let mycrc = checkSum(bufRecv,len+7-1); //校验和
                            // console.log(mycrc);
                            // console.log(bufRecv[len+7-1].toString(16));

                            if(mycrc!==bufRecv[len+7-1].toString(16)){
                                bufs = []; //校验失败清空缓存
                                // bufRecv.fill(0);
                                console.log("ECC error");
                            }

                            let temp = (bufRecv[4]*256 + bufRecv[5])/10.0; //温度
                            let humi = (bufRecv[6] * 256 + bufRecv[7]); //湿度
                            let ch2o = (bufRecv[8] * 256 + bufRecv[9]) / 1000.0; //CH2O
                            let co2 = (bufRecv[10] * 256 + bufRecv[11]); //CO2
                            let pm2d5 = (bufRecv[12] * 256 + bufRecv[13]); //PM2.5
                            let voc = (bufRecv[14] * 256 + bufRecv[15]); //voc
                            let battery = (bufRecv[16] * 256 + bufRecv[17]) / 1000.0; //电量
                            let nowtime = getNowFormatDate();

                            _document = {
                                'id': key,
                                'temp':temp,
                                'humi':humi,
                                'ch2o':ch2o,
                                'co2':co2,
                                'pm2d5':pm2d5,
                                'voc':voc,
                                'battery':battery,
                                'time':nowtime
                            };

                            //插入数据=>mongodb
                            sensordata.insert(_document,function(err,result){
                                if(err){
                                    console.log('Error:'+err);
                                }else{
                                    // console.log('Result:'+result);
                                }
                            });

                            mySocket.emit('sensordata_server', _document); //发送sensordata数据到客户端
                            mySocket.on('sensordata_user', function (data) {
                                console.log(data);
                            });
                        }
                    }
                }
                bufs = []; //解析完成后清空缓存
            });
        });
    });

    port.on('error',function(err){
        console.log('Error: ',err.message);
        res.send(err);
    });
});

//连接db
db.open(function(err, db){
    if(!err){
        console.log('connect db');
        db.createCollection('serialtest',function(err, collection){ //创建table
            if(err){
                console.log(err);
            }else{
                sensordata = collection;
            }
        });
    }else{
        console.log(err);
    }
});

// console.log(new Date().toLocaleString()); //2017-08-31 11:46:01

//校验和
function checkSum(buffer,len){
    let ir = 0;
    for(let i=0;i<len;i++){
        ir += buffer[i];
    }
    ir&=0xff; //补码
    ir = (255-ir+1).toString(16);
    return ir;
}

//格式化时间
function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "/";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let days = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let timeArr = [month,days,hours,minutes,seconds];
    for(let i=0;i<timeArr.length;i++){
        if(timeArr[i] <= 9){
            timeArr[i] = "0" + timeArr[i];
        }
    }
    let currentdate = date.getFullYear() + seperator1 + timeArr[0] + seperator1 + timeArr[1]
          + " " + timeArr[2] + seperator2 + timeArr[3] + seperator2 + timeArr[4];
    return currentdate;
}

