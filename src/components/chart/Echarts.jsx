import React, { Component } from 'react'; 
import BreadcrumbCustom from '../common/BreadcrumbCustom';

export default class Echarts extends Component{
    render(){
        return(
            <div>
                <BreadcrumbCustom paths={['首页','图表','echarts']}/>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    echarts
                </div>
            </div>
        )
    }
}