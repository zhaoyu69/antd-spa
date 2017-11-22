import React, {Component} from 'react';
import { Icon, Row, Col, Tree, Card } from 'antd';
import CountUp from 'react-countup';
import ReactEcharts from 'echarts-for-react';

const TreeNode = Tree.TreeNode;
const sensorField = ["温度","湿度","甲醛","CO2","PM2.5","VOC"];
const sensorUnit = ["℃","%RH","ppm","ppm","ug/m³","mg/m³"];

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
        count:0, //X轴坐标
    };
    componentDidMount(){
        const socket = this.props.socket;
        const { nodelist } = this.state;
        // 接受实时消息
        socket.on('sensordata', function (data) {
            /*
            * 业务逻辑：
            * 如果节点集合中没有该包的id就将id加入集合，然后更新state。
            * 如果节点集合长度为1，这时候默认选中这个id，并更新一次数据。
            * 如果节点集合中包含该包的id就判断这个id是否等于选中的id，相等则更新数据，不相等就不更新数据
            * */
            if(!isContains(nodelist,data.id)){
                nodelist.push(data.id);
                this.setState({
                    nodelist: nodelist,
                });
                if(nodelist.length===1){
                    this.setState((prevState) => ({
                        selectedNode: data.id,
                        nowSensordata: [data.temp, data.humi, data.choh, data.co2, data.pm2d5, data.voc],
                        prevSensordata: prevState.nowSensordata,
                    }));
                }
            }else{
                if(this.state.selectedNode===data.id){
                    // console.log('selectedNode === data.id');
                    this.setState((prevState) => ({
                        nowSensordata: [data.temp, data.humi, data.choh, data.co2, data.pm2d5, data.voc],
                        prevSensordata: prevState.nowSensordata,
                    }));
                }
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
        })
    };
    //charts配置
    getOption = () => {
        const count = 50;
        let data = {
            xd:[],
            yd:[],
        };
        for (let i = 0; i < count; i++) {
            data.xd.push(i);
            data.yd.push(Math.floor(Math.random() * i));
        }
        const option = {
            title:{
                text:'曲线图',
                left:'center',
            },
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            xAxis:{
                data: data.xd
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series:{
                name:'温度',
                type:'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data.yd
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
                                <Icon type="caret-up" style={{color:'red'}}/>
                                <span style={{color:'red',marginLeft:'10px'}}> { (start-end).toFixed(3) } </span>
                            </p>
                        }

                    </Card>
                </Col>
            )
        }.bind(this));
        //实时曲线图
        const showChart = sensorField.map(function (item) {
            return (
                <Col md={8} key={item}>
                    <ReactEcharts option={this.getOption()} style={{width:'100%',height:'300px'}}/>
                </Col>
            )
        }.bind(this));
        return(
            <div className="monitor">
                <Row gutter={16}>
                    <Col md={3}>
                        <Tree defaultExpandAll={true} onSelect={this.selectTreeNode}>
                            <TreeNode title={<span><Icon type="switcher" /> 节点列表</span>}>
                                <TreeNode key="123" title="123"/>
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