import React, {Component} from 'react';
import { Icon, Row, Col, Tree, Card } from 'antd';
import CountUp from 'react-countup';
import ReactEcharts from 'echarts-for-react';

const TreeNode = Tree.TreeNode;
const sensorField = ["温度","湿度","甲醛","CO2","PM2.5","VOC"];
const sensorUnit = ["℃","%RH","ppm","ppm","ug/m³","mg/m³"];
const XMAX = 50;

//数组是否包含某元素
function isContains(arr,obj){
    for(let i = 0; i < arr.length; i++){
        if(arr[i]===obj){
            return true;
        }
    }
    return false;
}

export default class DigitalMonitor extends Component{
    state = {
        selectedNode:'', //选中节点
        nodelist:[], //节点集合
        prevSensordata:[0,0,0,0,0,0], //上一包数据
        nowSensordata:[0,0,0,0,0,0],//当前包数据
        count:0, //x轴变化量
        countlist: [], //x轴数据集合
        seriesdata: {
            temp:[],
            humi:[],
            choh:[],
            co2:[],
            pm2d5:[],
            voc:[]
        }, //series数据集合
    };
    componentDidMount(){
        const socket = this.props.socket;
        // 接受实时消息
        socket.on('sensordata', function (data) {
            const { selectedNode, count, countlist, seriesdata, nodelist } = this.state;
            /*
            * 业务逻辑：
            * 如果节点集合中没有该包的id就将id加入集合，然后更新state。
            * 如果节点集合长度为1，这时候默认选中这个id，并更新一次数据。
            * 如果节点集合中包含该包的id就判断这个id是否等于选中的id，相等则更新数据，不相等就不更新数据
            * */
            if(!isContains(nodelist,data.id)) {
                nodelist.push(data.id);
                this.setState({
                    nodelist: nodelist,
                });
                if(nodelist.length===1){
                    this.setState({ selectedNode: data.id });
                    for(let item in seriesdata){
                        seriesdata[item].length>=XMAX?seriesdata[item].shift():seriesdata[item];
                        seriesdata[item].push(data[item]);
                    }
                    countlist.length>=XMAX?countlist.shift():countlist;
                    countlist.push(count);
                    this.setState((prevState) => ({
                        nowSensordata: [data.temp, data.humi, data.choh, data.co2, data.pm2d5, data.voc],
                        prevSensordata: prevState.nowSensordata,
                        count: count + 1,
                        countlist: countlist,
                        seriesdata:seriesdata,
                    }));
                }
            }
            if(selectedNode===data.id){
                for(let item in seriesdata){
                    seriesdata[item].length>=XMAX?seriesdata[item].shift():seriesdata[item];
                    seriesdata[item].push(data[item]);
                }
                countlist.length>=XMAX?countlist.shift():countlist;
                countlist.push(count);
                this.setState((prevState) => ({
                    nowSensordata: [data.temp, data.humi, data.choh, data.co2, data.pm2d5, data.voc],
                    prevSensordata: prevState.nowSensordata,
                    count: count + 1,
                    countlist: countlist,
                    seriesdata:seriesdata,
                }));
            }
        }.bind(this));
    }
    //动态添加树节点
    renderTreeNodes = (data) => {
        return data.map((item) => {
            return <TreeNode title={<span>{"节点" + item}</span>} key={item} />;
        });
    };
    //选择树节点 清空数据
    selectTreeNode = (selectedKeys) => {
        this.setState({
            selectedNode: selectedKeys[0],
            prevSensordata:[0,0,0,0,0,0],
            nowSensordata:[0,0,0,0,0,0],
            count:0,
            countlist: [],
            seriesdata: {
                temp:[],
                humi:[],
                choh:[],
                co2:[],
                pm2d5:[],
                voc:[]
            },
        })
    };
    //charts配置
    getOption = (index, title, unit) => {
        const { countlist, seriesdata} = this.state;
        const option = {
            title:{
                text: title + '['+unit+']',
                left: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '16'
                }
            },
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            grid:{
                show: true,
                right:10,
                top:40,
                bottom:40,
            },
            xAxis:{
                type: 'category',
                boundaryGap: false,
                data: countlist,
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitline: {
                    show: true
                },
            },
            series:{
                name:'温度',
                type:'line',
                smooth : 0.3,
                color: ['#108ee9'],
                data: (function(){
                    switch (index){
                        case 0: return seriesdata.temp;
                        case 1: return seriesdata.humi;
                        case 2: return seriesdata.choh;
                        case 3: return seriesdata.co2;
                        case 4: return seriesdata.pm2d5;
                        case 5: return seriesdata.voc;
                    }
                }.bind(this))()
            }
        };
        return option;
    };
    render(){
        const { nodelist, nowSensordata, prevSensordata } = this.state;
        //实时显示值
        const showValue = sensorField.map(function (item, index) {
            const start = prevSensordata[index];
            const end = nowSensordata[index];
            return (
                <Col sm={12} md={8} lg={4} key={item}>
                    <Card title={item+" ["+sensorUnit[index]+"] "} style={{marginBottom:'20px'}}>
                        <p style={{fontSize:'28px'}}>
                            <CountUp start={start} end={end} duration={1} decimals={3} decimal="."/>
                        </p>
                        {
                            end-start >= 0?
                            <p className="updown">
                                <Icon type="caret-up" style={{color:'green'}}/>
                                <span style={{color:'green',marginLeft:'10px'}}> { (end-start).toFixed(3) } </span>
                            </p>:<p className="updown">
                                <Icon type="caret-down" style={{color:'red'}}/>
                                <span style={{color:'red',marginLeft:'10px'}}> { (start-end).toFixed(3) } </span>
                            </p>
                        }
                    </Card>
                </Col>
            )
        }.bind(this));
        //实时曲线图
        const showChart = sensorField.map(function (item, index) {
            return (
                <Col md={8} key={item}>
                    <ReactEcharts
                        option={this.getOption(index, item, sensorUnit[index])}
                        style={{width:'100%',height:'300px'}}
                    />
                </Col>
            )
        }.bind(this));
        return(
            <div className="monitor">
                <Row gutter={16}>
                    <Col md={3}>
                        <Tree defaultExpandAll={true} onSelect={this.selectTreeNode}>
                            <TreeNode title={<span><Icon type="switcher" /> 节点列表</span>}>
                                {this.renderTreeNodes(nodelist)}
                            </TreeNode>
                        </Tree>
                    </Col>
                    <Col md={21}>
                        <Row gutter={16}>
                            {showValue}
                        </Row>
                        <Row gutter={16}>
                            {showChart}
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}