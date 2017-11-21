import React, {Component} from 'react';
import { Icon, Row, Col, Tree, Card } from 'antd';
import CountUp from 'react-countup';
import ReactEcharts from 'echarts-for-react';

const TreeNode = Tree.TreeNode;
const sensorField = ["温度","湿度","甲醛","CO2","PM2.5","VOC"];
const sensorUnit = ["℃","%RH","ppm","ppm","ug/m³","mg/m³"];

export default class DigitalMonitor extends Component{
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
        const showValue = sensorField.map(function (item, index) {
            return (
                <Col sm={12} md={8} lg={4} key={item}>
                    <Card title={item+" ["+sensorUnit[index]+"] "} style={{marginBottom:'20px'}}>
                        <p style={{fontSize:'28px'}}><CountUp start={0} end={3596.125} duration={1} separator="," decimals={3} decimal="."/></p>
                        <p className="updown"><Icon type="caret-up" style={{color:'green'}}/><span style={{color:'green',marginLeft:'10px'}}>32.87</span></p>
                    </Card>
                </Col>
            )
        }.bind(this));
        const showChart = sensorField.map(function (item, index) {
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
                        <Tree draggable={true}>
                            <TreeNode title={<span><Icon type="switcher" /> 节点列表</span>}>

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