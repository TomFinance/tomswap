import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home/Home'
import Tom2 from './Tom2/Tom2'
import Exchange from 'Exchange/Exchange'
import Tom2Stake from 'Tom2/Tom2Stake'

function Body() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/exchange/:route" component={Exchange} />
            <Route exact path="/tom2" component={Tom2} />
            <Route exact path="/tom2/detail/:route" component={Tom2Stake} />

            <Redirect from="*" to={'/'} />
        </Switch>
    )
}

export default Body
