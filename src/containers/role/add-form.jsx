import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select
} from 'antd'

const Item = Form.Item
const { Option } = Select
/*
添加分类的form组件
 */
class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 6 },  // 左侧label的宽度
            wrapperCol: { span: 12 }, // 右侧包裹的宽度
        }

        return (
            <Form>
                <Item label='管理员名称' {...formItemLayout}>
                    {
                        getFieldDecorator('user_name', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '管理员名称必须输入' }
                            ]
                        })(
                            <Input placeholder='请输入管理员名称' />
                        )
                    }
                </Item>
                <Item label='管理员密码' {...formItemLayout}>
                    {
                        getFieldDecorator('password', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '管理员密码必须输入' }
                            ]
                        })(
                            <Input placeholder='请输入管理员密码' />
                        )
                    }
                </Item>
                <Item label='管理员密码' {...formItemLayout}>
                    {
                        getFieldDecorator('status', {
                            initialValue: 1
                        })(
                            <Select>
                                <Option value={1} >管理员</Option>
                                <Option value={2} >超级管理员</Option>
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)