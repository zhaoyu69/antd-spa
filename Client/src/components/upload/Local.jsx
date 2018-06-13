import React from 'react';
import { Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;
const LOCAL_SERVER = "http://localhost:8080/upload";

const props = {
    name: 'file',
    listType: 'picture',
    multiple: true,
    action: LOCAL_SERVER,
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

export default class Local extends React.Component{
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖拽上传</p>
                    <p className="ant-upload-hint">本地文件服务</p>
                </Dragger>
            </div>
        );
    }

}