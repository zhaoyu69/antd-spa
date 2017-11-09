import React, { Component } from 'react';
import { Table, Icon, Select } from 'antd';

const Option = Select.Option;
const columns = [{
    title: '姓名',
    dataIndex: 'name',
}, {
    title: '性别',
    dataIndex: 'sex',
}, {
    title: '年龄',
    dataIndex: 'age',
},{
    title: '地址',
    dataIndex: 'address',
},{
    title: '手机号',
    dataIndex: 'phone',
},{
    title: '邮箱',
    dataIndex: 'email',
},{
    title: '网址',
    dataIndex: 'website',
},{
    title: '创建时间',
    dataIndex: 'createtime',
},{
    title: '操作',
    dataIndex: '',
    // render: () =>
    //     <Select>
    //         <Option></Option>
    //     </Select>
}];
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
    render(){
        const { data } = this.props;
        return(
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                bordered={true}
                className='formTable'/>
        )
    }
}