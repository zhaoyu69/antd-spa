import React,{Component} from 'react';
import { Form, Row, Col, Select, Button, DatePicker, Table, Pagination, Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

let conditions = {};
class SearchDataTemp extends Component{
    state = {
        idArr: [],
        pageSize: 10,
        total: 0,
        current: 1,
        dataSource: [],
        tableLoading: false,
    };

    fetchToTable = (values) => {
        values["pageSize"] = this.state.pageSize;
        values["current"] = this.state.current;
        conditions = values;
        fetch('http://localhost/search',{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        }).then(response => {
            response.json().then(function(data){
                console.log(data); //data , count
                let _data = [];
                data.data.map(function (item, index) {
                    item["key"] = index;
                    _data.push(item);
                });
                // console.log(_data);
                this.setState({
                    dataSource: _data,
                    total: data.count,
                    tableLoading: false,
                })
            }.bind(this));
        }).catch(e => console.log(e))
    };

    handleSearch = (e) => {
        this.setState({ tableLoading: true });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            this.fetchToTable(values);
        });
    };

    handleReset = () => {
        this.setState({ tableLoading: true });
        this.props.form.resetFields();
        this.setState({
            dataSource: null,
            pageSize: 10,
            total: 0,
            current: 1,
            tableLoading: false,
        });
    };

    RangePicker_Select = (date, dateString) => {
        console.log(date, dateString);
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({ tableLoading: true });
        // console.log(current, pageSize);
        this.setState({
            current: current===0?1:current,
            pageSize: pageSize
        }, function () {
            JSON.stringify(conditions)!=='{}'?
                this.fetchToTable(conditions): this.setState({tableLoading: false});
        });
    };

    handlePageChange = (current, pageSize) => {
        this.setState({ tableLoading: true });
        this.setState({
            current: current,
            pageSize: pageSize,
        },function () {
            this.fetchToTable(conditions);
        });
    };

    componentDidMount(){
        // 获取ID生成下拉
        fetch('http://localhost/requestID')
            .then(response  => {
                // console.log(response.status);
                // console.log(response);
                // console.log(response.json());
                response.json().then(function(data){
                    // console.log(data);
                    this.setState({
                        idArr: data,
                    })
                }.bind(this));
            })
            .catch(e => {console.log("something wrong");
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const { idArr, pageSize, total, current, dataSource, tableLoading } = this.state;
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
                dataIndex: 'id',
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
        const IDOption = idArr.map(function (id) {
            return <Option value={id} key={id}>{id}</Option>
        });
        return(
            <div className="search">
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
                                        <Option value="All">All</Option>
                                        {IDOption}
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
                    dataSource={dataSource}
                    pagination={false}
                    loading={tableLoading}
                />
                <Pagination
                    className="pag"
                    showSizeChanger
                    onShowSizeChange={this.onShowSizeChange}
                    pageSize={pageSize}
                    current={current}
                    total={total}
                    showTotal={(total, range) => `Total ${total} Items`}
                    onChange={this.handlePageChange}
                />
            </div>
        )
    }
}

const SearchData = Form.create()(SearchDataTemp);
export default SearchData;