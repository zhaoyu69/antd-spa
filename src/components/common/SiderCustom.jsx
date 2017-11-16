import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class SiderCustom extends Component{
    constructor(props){
        super(props);
        const { collapsed, path } = props;
        this.state = {
            collapsed: collapsed,
            mode: 'inline',
            firstHide: true,
            openKey: path.substr(0, path.lastIndexOf('/')),
        }
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    openMenu = v => {
        console.log(v);
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render(){
        const { path } = this.props;
        const { collapsed, mode, firstHide, openKey } = this.state;
        return(
            <Sider
            trigger={null}
            collapsed={collapsed}
            >
                <div className="logo" style={collapsed?{backgroundSize:'70%'}:{backgroundSize:'30%'}}/>
                <Menu 
                    theme="dark"
                    mode={mode}
                    defaultSelectedKeys={[path]}
                    selectedKeys={[path]}
                    onOpenChange={this.openMenu}
                    openKeys={firstHide ? null : [openKey]}
                >

                    <Menu.Item key={"/app"}>
                        <Link to={"/app"}><Icon type="home" /><span>首页</span></Link>
                    </Menu.Item>
                    <Menu.Item key={"/app/form"}>
                        <Link to={"/app/form"}><Icon type="edit" /><span>表单</span></Link>
                    </Menu.Item>
                    <SubMenu
                    key="/app/chart"
                    title={<span><Icon type="area-chart" /><span>图表</span></span>}
                    >
                        <Menu.Item key="/app/chart/echarts">
                            <Link to={'/app/chart/echarts'}><span>echarts</span></Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
} 