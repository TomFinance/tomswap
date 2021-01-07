import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { LP_TOKEN_PAIRS } from 'config'
import { convertDecimal } from 'utils/utils'
import { getMyLpTokenBalance, getTotalSupply } from 'utils/web3Utils'

const Home = () => {
    const [balanceObj, setBalanceObj] = useState({
        myTomBalance: 0,
        totalSupply: 0
    })

    useEffect(() => {
        getTotalSupply()
            .then(res => {
                setBalanceObj({
                    ...balanceObj,
                    totalSupply: res
                })
            })
            .then(async () => {
                const dataList = await Promise.all(
                    Object.keys(LP_TOKEN_PAIRS)
                        .map(lpTokenSymbol => {
                            return getMyLpTokenBalance(lpTokenSymbol)
                        }))
                setBalanceObj(dataList.reduce((acc, { tom2Amount, stakedToken }) => {
                    return {
                        myTomBalance: acc.myTomBalance + Number(tom2Amount),
                        totalSupply: acc.totalSupply + Number(stakedToken),
                    }
                }, {
                    myTomBalance: 0,
                    totalSupply: 0
                }))
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Helmet>
                <title>TOM2 FANANCE - HOME</title>
            </Helmet>
            <div className="main_top">
                <div className="wrapper">
                    <div className="tit">
                        <p className="img"><img src="/images/ico/ico_main.png" alt="" /></p>
                        <p className="txt"><img src="/images/ico/ico_tit.png" alt="" /></p>
                        <h3>Stake TOM LP tokens to get TOM2!</h3>
                    </div>
                </div>
            </div>
            <div id="jsHomeMyBalance" className="main_btm wrapper">
                <div className="figure">
                    <div className="balance">
                        <p>My TOM Balance</p>
                        <strong>{convertDecimal(Number(balanceObj.myTomBalance), 18)}</strong>
                        {/* <div className="pend">
                            <p>Pending harvest</p>
                            <span>0.00000000</span>
                        </div> */}
                    </div>
                    <div className="supply">
                        <p>Current Total supply</p>
                        <strong>{convertDecimal(Number(balanceObj.totalSupply), 18)}</strong>
                        {/* <div className="pend">
                            <p>APY</p>
                            <span>10.00000000 TOM2</span>
                        </div> */}
                    </div>
                </div>
                <Link to="/farm" className="main_btn">See the Touch of Midas Farm</Link>
            </div>
        </div>
    )
}

export default Home