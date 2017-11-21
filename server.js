const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser'); //中间件
const io = require('socket.io')(server);
const moment = require('moment');
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
            let bufs = []; //缓存数组
            port.on('data',function (data) {
                bufs.push(data);
                let buf = Buffer.concat(bufs);
                let _document = {}; //json
                //协议解析
                if(buf.length>=5){
                    if(buf[0]===0xCC && buf[1]===0xDD){
                        let key = buf[2].toString(16); //ID
                        // console.log(key);
                        let len = buf[3];//数据长度
                        // console.log(len);
                        if(buf.length>=len+7){

                            let bufRecv = new Buffer(len+7);
                            buf.copy(bufRecv, 0, len+7);

                            let mycrc = checkSum(bufRecv,len+7-1); //校验和

                            if(mycrc!==buf[len+7-1].toString(16)){
                                buf.slice(0, len+7); //校验失败删除这一包数据
                                console.log("ECC error");
                            }

                            let temp = (buf[4] * 256 + buf[5]) / 10.0; //温度
                            let humi = (buf[6] * 256 + buf[7]) / 10.0; //湿度
                            let choh = (buf[8] * 256 + buf[9]) / 1000.0; //CH2O
                            let co2 = (buf[10] * 256 + buf[11]); //CO2
                            let pm2d5 = (buf[12] * 256 + buf[13]); //PM2.5
                            let voc = (buf[14] * 256 + buf[15]) / 1000.0; //voc
                            let battery = (buf[16] * 256 + buf[17]) / 1000.0; //电量
                            let nowtime = moment().format("YYYY-MM-DD hh:mm:ss");

                            _document = {
                                'id': key,
                                'temp':temp,
                                'humi':humi,
                                'choh':choh,
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
                                }
                            });

                            mySocket.emit('sensordata_server', _document); //发送sensordata数据到客户端
                            mySocket.on('sensordata_user', function (data) {
                                console.log(data);
                            });
                        }
                        buf.slice(0, len+7); //解析完成后清空缓存
                    }
                }
            });
        });
    });

    port.on('error',function(err){
        console.log('Error: ',err.message);
        res.send(err);
    });
});

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


