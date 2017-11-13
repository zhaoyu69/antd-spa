import React, { Component } from 'react';
import './form.less';

import axios from 'axios';
import Mock from 'mockjs';
import moment from 'moment';
import { Row, Col, Input, Icon, Select, Cascader, DatePicker, Button, Tooltip, Popconfirm } from 'antd';

import BreadcrumbCustom from '../common/BreadcrumbCustom';
import address from './request/address.json';
import data from './request/data.json';
import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';

const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;
const options = [];
const { RangePicker } = DatePicker;

//数组中是否包含某项
function isContains(arr, item){
    let boo = false;
    arr.map(function (ar) {
        if(ar === item){
            boo = true;
        }
    });
    return boo;
}

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
            dataSource: data, //初始数据
            count: data.length,
            selectedRowKeys: [],
            modalVisible: false,
        };
    }
    //用户名输入
    onChangeUserName = (e) => {
        this.setState({ userName: e.target.value });
    };
    //时间选择
    RangePicker_Select = (date, dateString) => {
        console.log(date, dateString);
        this.setState({ timeRange: date });
    };
    componentDidMount(){
        Mock.mock('/address', address);
        axios.get('/address')
            .then(function (response) {
                console.log(response.data);
                response.data.map(function(province){
                    options.push({
                        value: province.name,
                        label: province.name,
                        children: province.city.map(function(city){
                            return {
                                value: city.name,
                                label: city.name,
                                children: city.area.map(function(area){
                                    return {
                                        value: area,
                                        label: area,
                                    }
                                })
                            }
                        }),
                    })
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    btnSearch_Click = () => {

    };
    //重置
    btnClear_Click = () => {
        this.setState({
            userName: '',
            address: '',
            timeRange: '',
            dataSource: data,
            count: data.length,
        });
    };
    //地址级联选择
    Cascader_Select = (value) => {
        this.setState({ address: value });
    };
    //新建信息弹窗
    CreateItem = () => {
        this.setState({ visible: true });
    };
    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };
    //填充表格行
    handleCreate = () => {
        const { dataSource, count } = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            values.key = count;
            values.address = values.address.join(" / ");
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");

            form.resetFields();
            this.setState({
                visible: false,
                dataSource: [...dataSource, values],
                count: count+1,
            });
        });
    };
    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };
    //批量删除
    MinusClick = () => {
        const { dataSource, selectedRowKeys } = this.state;
        this.setState({
            dataSource: dataSource.filter(item => !isContains(selectedRowKeys, item.key)),
        });
    };
    //单选框改变选择
    checkChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRowKeys: selectedRowKeys});
    };
    render(){
        const { userName, address, timeRange, dataSource, visible, modalVisible } = this.state;
        const questiontxt = ()=>{
            return (
                <p>
                    <Icon type="plus-circle-o" /> : 新建信息<br/>
                    <Icon type="minus-circle-o" /> : 批量删除
                </p>
            )
        };
        return(
            <div>
                <BreadcrumbCustom paths={['首页','表单']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={8}>
                            <Search
                                placeholder="Input Name"
                                prefix={<Icon type="user" />}
                                value={userName}
                                onChange={this.onChangeUserName}
                                onSearch={value => console.log(value)}
                            />
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <InputGroup compact>
                                <Cascader style={{ width: '100%' }} options={options} placeholder="Select Address" onChange={this.Cascader_Select} value={address}/>
                            </InputGroup>
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <RangePicker style={{ width:'100%' }} onChange={this.RangePicker_Select} value={timeRange}/>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <div className='plus' onClick={this.CreateItem}>
                            <Icon type="plus-circle" />
                            <CollectionCreateForm
                                ref={this.saveFormRef}
                                visible={visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                title="新建信息"
                                okText="创建"
                            />
                        </div>
                        <div className='minus'>
                            <Popconfirm title="确定要批量删除吗?" onConfirm={this.MinusClick}>
                                <Icon type="minus-circle" />
                            </Popconfirm>
                        </div>
                        <div className='question'>
                            <Tooltip placement="right" title={questiontxt}>
                                <Icon type="question-circle" />
                            </Tooltip>
                        </div>
                        <div className='btnOpera'>
                            <Button type="primary" onClick={this.btnSearch_Click} style={{marginRight:'10px'}}>查询</Button>
                            <Button type="primary" onClick={this.btnClear_Click} style={{background:'#f8f8f8', color: '#108ee9'}}>重置</Button>
                        </div>
                    </Row>
                    <FormTable dataSource={dataSource} checkChange={this.checkChange}></FormTable>
                </div>
            </div>
        )
    }
}