const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser'); //中间件
const io = require('socket.io')(server);
const moment = require('moment');

//mongodb数据库操作
const mongodb = require('mongodb');
const serverdb = new mongodb.Server('localhost',27017,{auto_reconnect:true});
const db = new mongodb.Db('nodetest',serverdb,{safe:true});
let sensordata; //表

//serialport串口操作
let serialPort = require('serialport');
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

/*
* 原本的想法是数据实时发送给客户端就行，客户端发送连接POST数据到服务器不需要socket，仅仅使用api接口就行,但是并不可行
* 所以和除了简单的数据交互和操作mongodb使用api直接fetch，其他需要实时响应的均使用socket.io。
* */
/*app.post('/connect',function(req,res){
    console.log(req.body);
    const config = req.body;
});*/
let _port = {};
io.on('connect',function(socket){
    socket.on('config',function (config) {
        // console.log(config);
        //新建串口
        _port = new serialPort(config.COM,{
            baudRate:parseInt(config.baudRate),
            dataBits:parseInt(config.dataBits),
            parity:config.parity,
            stopBits:parseFloat(config.stopBits),
            flowControl:config.flowControl,
        });

        //串口打开
        _port.on('open',function () {
            console.log('port open');
        });

        //串口接受数据
        _port.on('data',function (data) {
            let bufs = []; //缓存数组
            bufs.push(data);
            let buffer = Buffer.concat(bufs);
            console.log(buffer);
            //协议解析
            if(buffer.length>=5){
                if(buffer[0]===0xCC && buffer[1]===0xDD){
                    let key = buffer[2].toString(16); //ID
                    // console.log(key);
                    let len = buffer[3];//数据长度
                    // console.log(len);
                    if(buffer.length>=len+7){

                        let bufRecv = new Buffer(len+7);
                        buffer.copy(bufRecv, 0, 0, len+7);

                        let mycrc = checkSum(bufRecv,len+7-1); //校验和

                        if(mycrc!==buffer[len+7-1].toString(16)){
                            buffer.slice(0, len+7); //校验失败删除这一包数据
                            console.log("ECC error");
                            return;
                        }

                        let temp = (buffer[4] * 256 + buffer[5]) / 10.0; //温度
                        let humi = (buffer[6] * 256 + buffer[7]) / 10.0; //湿度
                        let choh = (buffer[8] * 256 + buffer[9]) / 1000.0; //CH2O
                        let co2 = (buffer[10] * 256 + buffer[11]); //CO2
                        let pm2d5 = (buffer[12] * 256 + buffer[13]); //PM2.5
                        let voc = (buffer[14] * 256 + buffer[15]) / 1000.0; //voc
                        let battery = (buffer[16] * 256 + buffer[17]) / 1000.0; //电量
                        let nowtime = moment().format("YYYY-MM-DD hh:mm:ss");

                        let _document = {
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
                        //实时发送到客户端
                        socket.emit('sensordata', _document);
                    }
                    buffer.slice(0, len+7); //解析完成后清空缓存
                }
            }
        });

        //串口错误信息
        _port.on('error',function(err){
            console.log('Error: ',err.message);
            socket.emit('port err', err.message);
        });
    });


    socket.on('isConn', function (msg) {
        console.log(msg);
        // console.log(_port);
        // console.log(_port!==null);
        socket.emit('re_isConn', JSON.stringify(_port) !== '{}' && _port !== null);
    });

    socket.on('cutdown', function (msg) {
        console.log(msg);
        _port.close(function () {
            _port = {};
            socket.emit('re_cutdown', true);
        });
    })
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


