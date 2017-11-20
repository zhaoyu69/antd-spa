import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import './acq1.less';
import CountUp from 'react-countup';
import ReactEcharts from 'echarts-for-react';
import SearchData from './SearchData';
import { Tabs, Icon, Row, Col, Tree, Form, Select, Button, Card } from 'antd';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const sensorField = ["温度","湿度","甲醛","CO2","PM2.5","VOC"];
const sensorUnit = ["℃","%RH","ppm","ppm","ug/m³","mg/m³"];

class ACQ1temp extends Component{
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
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
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
            <div>
                <BreadcrumbCustom paths={["首页","ACQ1"]}/>
                <div className="acq1body">
                    <Tabs defaultActiveKey="3">
                        <TabPane tab={<span><Icon type="tool" />串口配置</span>} key="1">
                            <div className="config">
                                <Row type="flex" justify="center">
                                    <Col md={12} xs={24}>
                                        <Form>
                                            <FormItem
                                                {...formItemLayout}
                                                label="串口"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('COM', {
                                                    initialValue:'COM1',
                                                    rules: [{
                                                        required: true, message: '请选择串口！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="COM1">COM1</Option>
                                                        <Option value="COM2">COM2</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="波特率"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('baudRate', {
                                                    initialValue:'115200',
                                                    rules: [{
                                                        required: true, message: '请选择波特率！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="9600">9600</Option>
                                                        <Option value="19200">19200</Option>
                                                        <Option value="38400">38400</Option>
                                                        <Option value="57600">57600</Option>
                                                        <Option value="115200">115200</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="数据位"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('dataBits', {
                                                    initialValue:'8',
                                                    rules: [{
                                                        required: true, message: '请选择数据位！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="5">5</Option>
                                                        <Option value="6">6</Option>
                                                        <Option value="7">7</Option>
                                                        <Option value="8">8</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="校验位"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('parity', {
                                                    initialValue:'none',
                                                    rules: [{
                                                        required: true, message: '请选择校验位！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="none">None</Option>
                                                        <Option value="even">Even</Option>
                                                        <Option value="odd">Odd</Option>
                                                        <Option value="mark">Mark</Option>
                                                        <Option value="space">Space</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="停止位"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('stopBits', {
                                                    initialValue:'1',
                                                    rules: [{
                                                        required: true, message: '请选择停止位！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="1">1</Option>
                                                        <Option value="1.5">1.5</Option>
                                                        <Option value="2">2</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="流控"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('flowControl', {
                                                    initialValue:'none',
                                                    rules: [{
                                                        required: true, message: '请选择流控！',
                                                    }],
                                                })(
                                                    <Select>
                                                        <Option value="none">None</Option>
                                                        <Option value="rts/cts">RTS/CTS</Option>
                                                        <Option value="xon/xoff">XON/XOFF</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem {...tailFormItemLayout}>
                                                <Button type="primary" htmlType="submit" style={{width:'100%'}}>连接</Button>
                                            </FormItem>
                                        </Form>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab={<span><Icon type="line-chart" />实时监控</span>} key="2">
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
                        </TabPane>
                        <TabPane tab={<span><Icon type="search" />数据查询</span>} key="3">
                            <div className="search">
                                <SearchData />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

const ACQ1 = Form.create()(ACQ1temp);
export default ACQ1;
