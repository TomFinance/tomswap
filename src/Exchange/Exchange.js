import React, { useEffect } from 'react'
import Swap from './Swap'
import ImportPool from './Pool/ImportPool'

const Exchange = ({ match: { params: { route } }, history }) => {

    useEffect(() => {
        if (!['swap', 'pool'].includes(route)) {
            history.replace('/')
        }
    }, [history, route])

    return route === 'swap'
        ? <Swap />
        : <ImportPool />
}

export default Exchange