import React, { Component } from 'react';
import { Table, Icon, Modal, Popconfirm } from 'antd';
const confirm = Modal.confirm;

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

export default class FormTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: props.dataSource,
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
    render(){
        const { dataSource } = this.state;
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
                    <span><Icon type="edit" /> 修改</span><br />
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