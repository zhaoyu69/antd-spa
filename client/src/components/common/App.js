import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../../style/index.less';
import {getCookie, setCookie} from "../../helpers/cookies";

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';
import MIndex from '../index/Index';
import Calendars from '../header/Calendars';
import Echarts from '../chart/echarts/Echarts';
import UForm from '../form/Form';
import noMatch from './404';
import RichText from "../richText/RichText";
import UploadEditor from "../upload/UploadEditor";

const {Content, Footer} = Layout;

export default class App extends Component {
    state = {
        collapsed: getCookie("mspa_SiderCollapsed") === "true",
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            setCookie("mspa_SiderCollapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (getCookie("mspa_SiderCollapsed") === null) {
            setCookie("mspa_SiderCollapsed", false);
        }
    }

    render() {
        const {collapsed} = this.state;
        const {location} = this.props;
        let name;
        console.log(typeof getCookie(""));
        if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
            return <Redirect to="/login"/>
        } else {
            name = JSON.parse(getCookie("mspa_user")).username;
        }

        return (
            <Layout className="ant-layout-has-sider" style={{height: '100%'}}>
                <SiderCustom collapsed={collapsed} path={location.pathname}/>
                <Layout>
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route exact path={'/app'} component={MIndex} />
                            <Route exact path={'/app/form'} component={UForm} />
                            <Route exact path={'/app/header/Calendars'} component={Calendars} />
                            <Route exact path={'/app/chart/echarts'} component={Echarts} />
                            <Route exact path={'/app/richText'} component={RichText} />
                            <Route exact path={'/app/upload'} component={UploadEditor} />
                            <Route component={noMatch} />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        MSPA ©2017-2018 Created by zysoft
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
