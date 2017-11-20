import React,{Component} from 'react';
import { Form, Row, Col, Select, Button, DatePicker, Table, Pagination} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class SearchDataTemp extends Component{

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    RangePicker_Select = (date, dateString) => {
        console.log(date, dateString);
    };

    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        const columns =
            [{
                title: 'ID',
                dataIndex: 'ID',
            },{
                title: '温度',
                dataIndex: 'temp',
            },{
                title: '湿度',
                dataIndex: 'humi',
            },{
                title: '甲醛',
                dataIndex: 'choh',
            },{
                title: 'CO2',
                dataIndex: 'co2',
            },{
                title: 'PM2.5',
                dataIndex: 'pm2d5',
            },{
                title: 'VOC',
                dataIndex: 'voc',
            },{
                title: '电量',
                dataIndex: 'battery',
            },{
                title: '时间',
                dataIndex: 'time',
            }];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return(
            <div>
                <Form
                    style={{height:'32px',display:'inline'}}  //如果没有display:inline 响应式时Table会覆盖在Form上
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={16}>
                        <Col md={8}>
                            <FormItem
                                label="ID"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('ID', {
                                    initialValue:'',
                                })(
                                    <Select>
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8}>
                            <FormItem
                                label="时间"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('time', {
                                    initialValue:'',
                                })(
                                    <RangePicker style={{width:'100%'}} onChange={this.RangePicker_Select}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} style={{textAlign:'right'}}>
                            <Button className="btn" type="primary" htmlType="submit">Search</Button>
                            <Button className="btn" style={{ marginLeft: 10 }} onClick={this.handleReset}>Clear</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    style={{marginTop:'20px'}}
                    rowSelection={rowSelection}
                    columns={columns}
                />
                <Pagination
                    className="pag"
                    showSizeChanger
                    onShowSizeChange={this.onShowSizeChange}
                    defaultCurrent={3}
                    total={500}
                    showTotal={(total, range) => `Total ${total} Items`}
                />
            </div>
        )
    }
}

const SearchData = Form.create()(SearchDataTemp);
export default SearchData;