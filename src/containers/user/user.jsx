import React from 'react'

import {
    Card,
    Table,
} from 'antd'

import { reqUserslist } from '../../api/index'
class User extends React.Component {
    state = {
        userList: []
    }
    // 获取管理员列表
    getUsers = async () => {
        const result = await reqUserslist()
        this.setState({
            userList: result.data
        })
    }

    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { userList } = this.state
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '姓名',
                dataIndex: 'username',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'registe_time',
                align: 'center',
            },
            {
                title: '地址',
                dataIndex: 'city',
                align: 'center',
            }
        ]
        return (
            <Card title='用户列表'>
                <Table
                    dataSource={userList}
                    columns={columns}
                    bordered
                >
                </Table>
            </Card>
        )
    }
}

export default User