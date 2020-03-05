import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './containers/login/login'
import Admin from './containers/admin/admin'

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/' component={Admin} />
                </Switch>
            </BrowserRouter>
        )
    }
}