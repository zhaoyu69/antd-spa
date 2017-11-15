import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import moment from 'moment';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const { checkChange, onDelete, editClick, dataSource, loading } = this.props;
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
            filters: [
                { text: '男', value: '男' },
                { text: '女', value: '女' },
            ],
            onFilter: (value, record) => record.sex.indexOf(value) === 0,
            width: 70,
        }, {
            title: '年龄',
            dataIndex: 'age',
            sorter: (a, b) => a.age - b.age,
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
            sorter: (a, b) => moment(a.createtime) - moment(b.createtime),
            width:150,
        },{
            title: '操作',
            dataIndex: 'opera',
            width:100,
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => editClick(record.key)}>
                         <Icon type="edit" /> 修改
                    </span><br />
                    <span><Popconfirm title="确定要删除吗?" onConfirm={() => onDelete(record.key)}><Icon type="minus-square-o" /> 删除 </Popconfirm></span>
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
                loading={loading}
            />
        )
    }
}
