import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;

const login = {
    username:'admin',
    password:'admin'
}

class NormalLoginForm extends Component {
    constructor(props){
        super(props);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if(values.username === login.username && values.password === login.password){
                    // console.log("ok");
                    localStorage.setItem('mspa_user',JSON.stringify(login));
                    this.props.history.push({pathname:'/user/'+values.username});
                }else{
                    // console.log("fail");
                    alert('login failed');
                }
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const Login = Form.create()(NormalLoginForm);

export default Login;