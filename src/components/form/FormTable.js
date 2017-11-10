import React, { Component } from 'react';
import { Table, Icon, Modal } from 'antd';
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
    }
    DeleteConfirm = (e) => {
        console.log(e.target.getAttribute("data-key"));
        confirm({
            title: '确定要删除么?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    render(){
        const { data, customizedform } = this.props;
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
            render: () =>
                <div className='opera'>
                    <span onClick={customizedform}><Icon type="edit" /> 修改</span><br />
                    <span onClick={this.DeleteConfirm}><Icon type="minus-square-o" /> 删除</span>
                </div>
        }];
        return(
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
            />
        )
    }
}