import React from 'react';
import { Upload, Icon, message } from 'antd';
import axios from 'axios';
const Dragger = Upload.Dragger;
const QINIU_SERVER = "http://upload.qiniup.com/";

export default class Qiniu extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state = { token: "", domain: "", fileList:[] };
        this.getUploadToken();
    }

    handleChange=(info)=>{
        const { domain } = this.state;
        let { file, fileList } = info;

        const status = file.status;
        if (status !== 'uploading') {
            console.log(file, fileList);
        }
        if (status === 'done') {
            message.success(`${file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }

        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = domain + "/" + file.response.key
            }
            return file;
        });

        this.setState({ fileList });
    };

    handleRemove=(file)=>{
        let { fileList } = this.state;
        fileList = fileList.filter(f=>f.status!=="removed");
        this.setState({fileList});
    };

    getUploadToken=()=>{
        // 从服务器获取 token
        axios.get('/qiniu/uptoken').then((response)=>{
            const { token, domain } = response.data;
            console.log("token:", token, "\ndomain:", domain);
            this.setState({token, domain});
        });
    };

    render() {
        const { token, fileList } = this.state;
        const props = {
            name: 'file',
            listType: 'picture',
            multiple: true,
            action: QINIU_SERVER,
            onChange: this.handleChange,
            onRemove: this.handleRemove,
            fileList,
            data: function (file) {
                return {
                    key: file.name,
                    token: token
                }
            }
        };
        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖拽上传</p>
                    <p className="ant-upload-hint">七牛云文件服务</p>
                </Dragger>
            </div>
        );
    }

}