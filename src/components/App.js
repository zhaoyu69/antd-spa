import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/index.less';
import noMatch from './404';
import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';

import MIndex from './index/Index';
import Calendars from './header/Calendars';
import Echarts from './chart/Echarts';
import UForm from './form/Form';

const {Content, Footer} = Layout;

function SiderCollapsed() {
    if (localStorage.getItem("mspa_SiderCollapsed") === "true") {
        return true;
    } else {
        return false;
    }
}

export default class App extends Component {
    state = {
        collapsed: SiderCollapsed(),
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            localStorage.setItem("mspa_SiderCollapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (localStorage.getItem("mspa_SiderCollapsed") == null) {
            localStorage.setItem("mspa_SiderCollapsed", false);
        }
    }

    render() {
        const {collapsed} = this.state;
        const {location} = this.props;
        let name;
        if (localStorage.getItem("mspa_user") === null) {
            return <Redirect to="/login"/>
        } else {
            name = location.state === undefined ? JSON.parse(localStorage.getItem("mspa_user")).username : location.state.username;
        }

        return (
            <Layout className="ant-layout-has-sider" style={{height: '100%'}}>
                <SiderCustom collapsed={collapsed} path={location.pathname}/>
                <Layout>
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route exact path={'/app'} component={MIndex}></Route>
                            <Route exact path={'/app/form'} component={UForm}></Route>
                            <Route exact path={'/app/header/Calendars'} component={Calendars}></Route>
                            <Route exact path={'/app/chart/echarts'} component={Echarts}></Route>
                            <Route component={noMatch}></Route>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        MSPA ©2017 Created by zysoft
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
