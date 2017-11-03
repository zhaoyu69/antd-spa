import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class SiderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed
        }
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        // console.log(collapsed);
        this.setState({
            collapsed,
        });
    };
    render(){
        const { path } = this.props;
        const { collapsed } = this.state;
        const openKey = path.substring(0,path.lastIndexOf('/'));
        return(
            <Sider
            trigger={null}
            collapsed={collapsed}
            style={{overflowY:'hidden'}}
            >
                <div className="logo" style={collapsed?{backgroundSize:'70%'}:{backgroundSize:'30%'}}/>
                <Menu 
                theme="dark" 
                mode="inline"
                defaultSelectedKeys={[path]} 
                selectedKeys={[path]}
                defaultOpenKeys={[openKey]}
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