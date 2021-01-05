import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home/Home'
import Farm from './Farm/Farm'
import Exchange from 'Exchange/Exchange'
import FarmStake from 'Farm/FarmStake'
import AddLiquidity from 'Exchange/Pool/AddLiquidity'
import ImportPool from 'Exchange/Pool/ImportPool'
import RemoveLiquidity from 'Exchange/Pool/RemoveLiquidity'

function Body() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/farm" component={Farm} />
            <Route exact path="/farm/detail/:route" component={FarmStake} />
            <Route exact path="/exchange/import-pool" component={ImportPool} />
            <Route exact path="/exchange/pool/add-liquidity" component={AddLiquidity} />
            <Route exact path="/exchange/pool/remove-liquidity" component={RemoveLiquidity} />
            <Route exact path="/exchange/:route" component={Exchange} />

            <Redirect from="*" to={'/'} />
        </Switch>
    )
}

export default Body
