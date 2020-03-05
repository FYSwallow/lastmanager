import React from 'react'
import { Upload, Icon, message } from 'antd';
import PropTypes from 'prop-types'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

// 检验文件
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('你只能上传格式为JPG/PNG的文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('文件不应大于2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class PictureUpload extends React.Component {
    // 静态检验
    static proTypes = {
        img: PropTypes.string
    }

    constructor(props) {
        super(props)
        let image_path = ''
        if (this.props.img) {
            image_path = this.props.img
        }

        // 初始化状态

        this.state = {
            image_path,
            loading: false,
        }
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, image_path =>
                this.setState({
                    image_path,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { image_path } = this.state;
        return (
            <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/img/add"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {image_path ? <img src={image_path} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        );
    }
}

export default PictureUpload
