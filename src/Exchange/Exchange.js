import React, { useEffect } from 'react'
import Swap from './Swap/Swap'
import Pool from './Pool'

const Exchange = ({ match: { params: { route } }, history }) => {

    useEffect(() => {
        if (!['swap', 'pool'].includes(route)) {
            history.replace('/')
        }
    }, [history, route])

    return route === 'swap'
        ? <Swap />
        : <Pool />
}

export default Exchange