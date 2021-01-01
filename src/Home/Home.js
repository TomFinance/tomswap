import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTotalSupply } from 'utils/web3Utils'

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
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
                        <strong>0.00000000</strong>
                        <div className="pend">
                            <p>Pending harvest</p>
                            <span>0.00000000</span>
                        </div>
                    </div>
                    <div className="supply">
                        <p>Current Total supply</p>
                        <strong>{typeof balanceObj.totalSupply === 'number' ? Number(balanceObj.totalSupply) > 0 ? Number(balanceObj.totalSupply).toPrecision(12) : (0).toPrecision(12) : '-'}</strong>
                        <div className="pend">
                            <p>APY</p>
                            <span>10.00000000 TOM2</span>
                        </div>
                    </div>
                </div>
                <Link to="/tom2" className="main_btn">See the Touch of Midas Farm</Link>
            </div>
        </div>
    )
}

export default Home