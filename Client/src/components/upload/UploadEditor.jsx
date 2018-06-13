import React, {Component} from 'react';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import { Row, Col } from 'antd';
import Local from "./Local";
import Qiniu from "./Qiniu";

export default class UploadEditor extends Component {
    render() {

        return (
            <div>
                <BreadcrumbCustom paths={['首页','文件上传']}/>
                <Row gutter={16}>
                    <Col md={12}>
                        <Local/>
                    </Col>
                    <Col md={12}>
                        <Qiniu/>
                    </Col>
                </Row>
            </div>
        );
    }

}