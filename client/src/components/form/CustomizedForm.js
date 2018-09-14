import React, { Component } from 'react';
import { Modal, Form, Input, Radio, InputNumber, Cascader, Select, AutoComplete } from 'antd';
import axios from 'axios';
import address from './request/address';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const options = [];

class CustomizedForm extends Component{
    state = {
        autoCompleteResult: [],
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
        axios.get('/address')
            .then(function (response) {
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
    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.cn', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };
    render(){
        const { visible, onCancel, onCreate, form, okText, title } = this.props;
        const { getFieldDecorator } = form;
        const { autoCompleteResult } = this.state;
        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal">
                    <FormItem label="姓名" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入姓名！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="性别" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('sex', {
                            rules: [{ required: true, message: '请选择性别！' }],
                        })(
                            <Radio.Group style={{marginRight: 20}}>
                                <Radio value='男'>男</Radio>
                                <Radio value='女'>女</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem label="年龄" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('age', {
                            rules: [{ required: true, message: '请输入年龄！' }],
                        })(
                            <InputNumber min={0} max={199} step={1} />
                        )}
                    </FormItem>
                    <FormItem label="地址" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请选择地址！' }],
                        })(
                            <Cascader options={options}/>
                        )}
                    </FormItem>
                    <FormItem label="手机号" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('phone', {
                            rules: [{
                                pattern: /^1(3|4|5|7|8)\d{9}$/, message: "手机号码格式不正确！"
                            },{
                                required: true, message: '请输入手机号！'
                            }],
                        })(
                            <Input addonBefore={"+86"} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    <FormItem label="邮箱" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '邮箱格式不正确！',
                            }, {
                                required: true, message: '请输入邮箱！',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="网址" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('website', {
                            rules: [{required: true, message: '请输入网址！'}],
                        })(
                            <AutoComplete
                                dataSource={websiteOptions}
                                onChange={this.handleWebsiteChange}
                            >
                                <Input/>
                            </AutoComplete>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;