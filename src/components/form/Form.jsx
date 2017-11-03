import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';

export default class UForm extends Component{
    render(){
        return(
            <div>
                <BreadcrumbCustom paths={['首页','表单']}/>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    Form
                </div>
            </div>
        )
    }
}