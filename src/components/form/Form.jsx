import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../style/form/form.less';
import { Row, Col, Input, Icon } from 'antd';

export default class UForm extends Component{
    render(){
        return(
            <div>
                <BreadcrumbCustom paths={['首页','表单']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        
                    </Row>
                </div>
            </div>
        )
    }
}