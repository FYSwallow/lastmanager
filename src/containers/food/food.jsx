import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import FoodHome from './home'
import AddUpdate from './add-food'
import AddFood from './add-food'
/*
商品路由
 */
class Food extends Component {
    render() {
        return (
            <Switch>
                <Route path='/food' component={FoodHome} exact /> {/*路径完全匹配*/}
                <Route path='/food/addupdate' component={AddUpdate} />
                <Route path='/food/addfood/:id' component={AddFood} />
            </Switch>
        )
    }
}
export default Food