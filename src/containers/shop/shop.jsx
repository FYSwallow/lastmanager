import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import ShopHome from './home'
import AddUpdate from './add-update'
/*
商品路由
 */
class Shop extends Component {
  render() {
    return (
      <Switch>
        <Route path='/shop' component={ShopHome} exact/> {/*路径完全匹配*/}
        <Route path='/shop/addupdate' component={AddUpdate} />
      </Switch>
    )
  }
}
export default Shop