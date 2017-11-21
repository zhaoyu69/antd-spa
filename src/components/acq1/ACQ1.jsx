import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import './ACQ1.less';
import SerialportConfig from './SerialportConfig';
import DigitalMonitor from './DigitalMonitor';
import SearchData from './SearchData';
import { Tabs, Icon } from 'antd';

const TabPane = Tabs.TabPane;
const io = require('socket.io-client');
const socket = io.connect('http://localhost',{'forceNew':true});

class ACQ1 extends Component{
    render(){
        return(
            <div>
                <BreadcrumbCustom paths={["首页","ACQ1"]}/>
                <div className="acq1body">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={<span><Icon type="tool" />串口配置</span>} key="1">
                            <SerialportConfig socket={socket}/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="line-chart" />实时监控</span>} key="2">
                            <DigitalMonitor />
                        </TabPane>
                        <TabPane tab={<span><Icon type="search" />数据查询</span>} key="3">
                            <SearchData />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default ACQ1;
