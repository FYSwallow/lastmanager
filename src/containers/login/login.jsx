import React from 'react'
import { Redirect } from 'react-router-dom'
import {
    Form,
    Input,
    Icon,
    Button,
    message
} from 'antd'
import { connect } from 'react-redux'

import { reqLogin } from '../../api/index'
import { getAdminInfo } from '../../redux/actions'
import './login.less'
import avatar from '../../assets/images/avatar.jpg'

const Item = Form.Item

/*
登录的路由组件
*/
class Login extends React.Component {
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { admin_name, password } = values;

                // 获取服务端信息
                const response = await reqLogin({ user_name: admin_name, password });
                const result = response.data;

                if (result.status === 1) {
                    message.success('登录成功');
                    this.props.getAdminInfo();
                } else {
                    message.error('请检查用户名及密码后重新登陆');
                }
            } else {
                message.error("校验失败");
            }
        });

    }

    // 对密码进行自定义验证
    validatorPwd = (rule, value, callback) => {
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
    }
    render() {
        // 如果用户已经登陆, 自动跳转到管理界面
        const admin = this.props.admin
        if (admin && admin.id) {
            return <Redirect to='/home' />
        }

        const { getFieldDecorator } = this.props.form
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={avatar} alt="avatar" />
                    <h1>
                        React-elm: 后台管理系统
                    </h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form className='login-form' onSubmit={this.handleSubmit}>
                        <Item>
                            {
                                // 声明式验证
                                getFieldDecorator('admin_name', {
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名必须输入' },
                                        { min: 2, message: '用户名至少2位' },
                                        { max: 12, message: '用户名最多12位' }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名" />
                                )
                            }
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { validator: this.validatorPwd }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码" />
                                )
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className='login-form-buttom'>登录</Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)
export default connect(
    state => ({ admin: state.admin }),
    { getAdminInfo }
)(WrapLogin)
