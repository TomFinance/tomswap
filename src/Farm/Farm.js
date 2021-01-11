import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MINING_POOLS } from 'config'

import { calculateAPY } from 'utils/web3Utils'
import { Helmet } from 'react-helmet'

const Farm = () => {
    const [apyList, setApyList] = useState([])

    const getApyList = useCallback(async () => {
        const apyList = await Promise.all(Object.keys(MINING_POOLS)
            .map(key => {
                return calculateAPY(MINING_POOLS[key])
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
                <title>TOM2 FANANCE - FARM</title>
            </Helmet>
            <div className="main_top">
                <div className="wrapper">
                    <div className="tit">
                        <p className="img"><img src="/images/ico/ico_main.png" alt="" /></p>
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
                            <div className={`tmtg ${alias}`} key={poolName}>
                                <p>{`${splitName[0]}/${splitName[1]} Pool`}</p>
                                <span>{`Desposit ${splitName[0]}/${splitName[1]} UNI-V2 LP Earn TOM2`}</span>
                                <Link className={'main_btn'} to={`/farm/detail/${alias}`}>Select</Link>
                                <div className="pend">
                                    <p>APY</p>
                                    <span>{`${apyList[idx]}`}</span>
                                </div>
                            </div>
                        )
                    })}
                    {/* <div className="lbxc coming red_mark">
                        <p>TOM/TMTG Pool</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <a href="#;" className="main_btn">COMING SOON</a>
                        <div className="pend">
                            <p>APY</p>
                            <span>0%</span>
                        </div>
                    </div>
                    <div className="tom_lb coming red_mark red_mark02">
                        <p>TOM/LBXC Pool</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <a href="#;" className="main_btn">COMING SOON</a>
                        <div className="pend">
                            <p>APY</p>
                            <span>0%</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Farm