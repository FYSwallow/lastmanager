import React from 'react'
import { connect } from 'react-redux'
import {
    Card,
    Table,
    Button,
    Modal,
    message,
} from 'antd'

import AddForm from './add-form'
import { reqAdminlist, addAdmin, deleteAdmin } from '../../api/index'
import { logout } from '../../redux/actions'
import LinkButton from '../../components/link-button/link-button'
class Role extends React.Component {
    state = {
        adminList: [],
        isShowAdd: false, // 是否显示添加界面
    }
    // 获取管理员列表
    getAdmins = async () => {
        const result = await reqAdminlist()
        this.setState({
            adminList: result.data
        })
    }
    // 添加管理员
    addAdmin = async () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { user_name, password } = values
                const result = await addAdmin({ user_name, password })
                if (result.data.status === 1) {
                    message.success('注册管理员成功')
                    this.setState({
                        isShowAdd: false
                    })
                    this.getAdmins()
                } else {
                    message.error('注册管理员失败')
                }
            }
        })
    }

    // 删除管理员
    deleteAdmin = async (admin) => {
        console.log(admin)
        if(admin.user_name === 'admin') {
            message.error('抱歉,当前管理员不可删除')
            return
        }
        const result = await deleteAdmin(admin.id)
        if (result.data.status) {
            message.success('管理员删除成功')
            if (this.props.admin.id === admin.id) {
                this.props.logout()
                // 跳转到login
                this.props.history.replace('/login')
            }
        } else {
            message.error('管理员删除失败')
        }

    }
    componentDidMount() {
        this.getAdmins()
    }
    render() {
        const { adminList, isShowAdd } = this.state
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '姓名',
                dataIndex: 'user_name',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                align: 'center',
            },
            {
                title: '地址',
                dataIndex: 'city',
                align: 'center',
            },
            {
                title: '权限',
                dataIndex: 'admin',
                align: 'center',
            },
            {
                title: '操作',
                width: 200,
                align: 'center',
                render: (shop) => (
                    <span>
                        <LinkButton onClick={() => this.deleteAdmin(shop)} style={{ color: 'red' }}>删除</LinkButton>
                    </span>
                )
            }
        ]
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
                {/* <Button type='primary' disabled={!role.id} onClick={() => this.setState({ isShowAuth: true })}>更新管理员信息</Button> */}
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={adminList}
                    columns={columns}
                    bordered
                    rowKey='id'
                // rowSelection={{
                //     type: 'radio',
                //     selectedRowKeys: [role.id],
                //     onSelect: (role) => { // 选择某个radio时回调
                //         this.setState({
                //             role
                //         })
                //     }

                // }}
                >
                </Table>
                <Modal
                    title="添加管理员"
                    visible={isShowAdd}
                    onOk={this.addAdmin}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({ admin: state.admin }),
    { logout }
)(Role)