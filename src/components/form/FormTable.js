import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import CollectionCreateForm from './CustomizedForm';
import moment from 'moment';

function replace(arr, item, place){ //arr 数组,item 数组其中一项, place 替换项
    arr.map(function (ar) {
        if(ar.key === item){
            arr.splice(arr.indexOf(ar),1,place)
        }
    });
    return arr;
}

function catchIndex(arr, key){ //获取INDEX
    let i = 0;
    arr.map(function (ar, index) {
        if(ar.key === key){
            i = index;
        }
    });
    return i;
}

export default class FormTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: props.dataSource,
            visible: false,
            tableRowKey: 0,
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            dataSource: nextProps.dataSource
        })
    }
    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };
    editClick = (key) => {
        const form = this.form;
        const { dataSource } = this.state;
        const index = catchIndex(dataSource, key);
        console.log(index);
        form.setFieldsValue({
            key: key,
            name: dataSource[index].name,
            sex: dataSource[index].sex,
            age: dataSource[index].age,
            address: dataSource[index].address.split(' / '),
            phone: dataSource[index].phone,
            email: dataSource[index].email,
            website: dataSource[index].website,
        });
        this.setState({
            visible: true,
            tableRowKey: key,
        });
    };
    //接受更新的表单数据
    saveFormRef = (form) => {
        this.form = form;
    };
    handleUpdate = () => {
        const form = this.form;
        const { dataSource, tableRowKey } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            values.key = tableRowKey;
            values.address = values.address.join(" / ");
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");

            form.resetFields();
            this.setState({
                visible: false,
                dataSource: replace(dataSource, tableRowKey, values)
            });
        });
    };
    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };
    render(){
        const { dataSource, visible } = this.state;
        const { checkChange } = this.props;
        const rowSelection = {
                onChange: checkChange,
                getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            width: 100,
        }, {
            title: '性别',
            dataIndex: 'sex',
            width: 70,
        }, {
            title: '年龄',
            dataIndex: 'age',
            width: 70,
        },{
            title: '地址',
            dataIndex: 'address',
            width: 200,
        },{
            title: '手机号',
            dataIndex: 'phone',
            width: 100,
        },{
            title: '邮箱',
            dataIndex: 'email',
            width:120,
        },{
            title: '网址',
            dataIndex: 'website',
            width:120,
        },{
            title: '创建时间',
            dataIndex: 'createtime',
            width:150,
        },{
            title: '操作',
            dataIndex: 'opera',
            width:100,
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => this.editClick(record.key)}>
                         <Icon type="edit" /> 修改
                         <CollectionCreateForm
                             ref={this.saveFormRef}
                             visible={visible}
                             onCancel={this.handleCancel}
                             onCreate={this.handleUpdate}
                             title="更新信息"
                             okText="更新"
                         />
                    </span><br />
                    <span><Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}><Icon type="minus-square-o" /> 删除 </Popconfirm></span>
                </div>
        }];
        return(
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
            />
        )
    }
}
