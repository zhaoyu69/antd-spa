import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import '../../style/form/form.less';
import axios from 'axios';
import Mock from 'mockjs';
import CollectionCreateForm from './CustomizedForm';
import Address from './Address';
import FormTable from './FormTable';
import { Row, Col, Input, Icon, Select, Cascader, DatePicker, Button, Tooltip } from 'antd';

const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;
const options = [];
const { RangePicker } = DatePicker;
const data = [{
    key: '1',
    name: '小明',
    sex: '男',
    age: 16,
    address: "北京市 / 北京市 / 东城区",
    phone: '18033669587',
    email: '845623545@qq.com',
    website: 'xm123.com'
},{
    key: '2',
    name: '老王',
    sex: '男',
    age: 39,
    address: "安徽省 / 蚌埠市 / 禹会区",
    phone: '13362589494',
    email: '563212@gmail.com',
    website: 'xw456.net'
},{
    key: '3',
    name: '小红',
    sex: '女',
    age: 19,
    address: "江苏省 / 南京市 / 栖霞区",
    phone: '17366452585',
    email: '66452585@163.com',
    website: 'xh789.cn'
}];

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
        };
    }
    onChangeUserName = (e) => {
        this.setState({ userName: e.target.value });
    };
    RangePicker_Select = (date, dateString) => {
        console.log(date, dateString);
        this.setState({ timeRange: date });
    };
    componentDidMount(){
        Mock.mock("/address", Address);
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
    btnClear_Click = () => {
        this.setState({
            userName: '',
            address: '',
            timeRange: '',
        });
    };
    Cascader_Select = (value) => {
        this.setState({ address: value });
    };
    CreateItem = () => {
        this.setState({ visible: true });
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            data.push(values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    render(){
        const { userName, address, timeRange } = this.state;
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
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                            />
                        </div>
                        <div className='minus'><Icon type="minus-circle" /></div>
                        <div className='question'>
                            <Tooltip placement="right" title={questiontxt}>
                                <Icon type="question-circle" />
                            </Tooltip>
                        </div>
                        <div className='btnOpera'>
                            <Button type="primary" onClick={this.btnSearch_Click} style={{marginRight:'10px'}}>查询</Button>
                            <Button type="primary" onClick={this.btnClear_Click} style={{background:'#f8f8f8', color: '#108ee9'}}>清空</Button>
                        </div>
                    </Row>
                    <FormTable data={data}/>
                </div>
            </div>
        )
    }
}