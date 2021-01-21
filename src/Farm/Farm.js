import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MINING_POOLS } from 'config'

import { calculateAPY } from 'utils/web3Utils'
import { Helmet } from 'react-helmet'
import { convertDecimal } from 'utils/utils'

const Farm = () => {
    const [apyList, setApyList] = useState([])

    const getApyList = useCallback(async () => {
        const apyList = await Promise.all(Object.keys(MINING_POOLS)
            .map(async key => {
                return await calculateAPY(key)
            })
        )

        setApyList(apyList)
    }, [])

    useEffect(() => {
        getApyList()
    }, [getApyList])

    return (
        <div>
            <Helmet>
                <title>TOMSWAP - FARM</title>
            </Helmet>
            <div className="main_top">
                <div className="wrapper">
                    <div className="tit">
                        <p className="img"><img src="/images/ico/tom2_logo.png" alt="" /></p>
                        <p className="txt txt02"><img src="/images/ico/ico_tit02.png" alt="" /></p>
                        <h3>Get TOM2 by staking TOM LP tokens.</h3>
                    </div>
                </div>
            </div>
            <div id="jsTom2GridLayout" className="main_btm">
                <div className="figure">
                    {MINING_POOLS && Object.keys(MINING_POOLS).map((poolName, idx) => {
                        const splitName = poolName.split('-')
                        const alias = `${splitName[0].toLowerCase()}-${splitName[1].toLowerCase()}`
                        return (
                            <div className={`tmtg ${alias} ${alias !== 'tmtg-lbxc' ? 'red_mark' : ''}`} key={poolName}>
                                <p>{`${splitName[0]}/${splitName[1]} Pool`}</p>
                                <span>{`Desposit ${splitName[0]}/${splitName[1]} tomswap LP Earn TOM2`}</span>
                                <Link className={'main_btn'} to={`/farm/detail/${alias}`}>Select</Link>
                                <div className="pend">
                                    <p>APY</p>
                                    <span>{`${convertDecimal(apyList[idx])}%`}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Farm