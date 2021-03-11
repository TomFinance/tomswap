import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { PRESET_TOKEN } from 'config'

import { convertDecimal } from 'utils/utils'
import { getTokenBalance, getTotalSupply } from 'utils/web3Utils'
import { getMetaMaskMyAccount } from 'utils/metaMask'

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & > strong {
        font-size: 24px;
    }
`

const DescriptionWrap = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    & > p {
        & > a {
            &:hover {
                color: #eab640;
            }
        }
    }
`

const CloseBtn = styled.button`
    margin: 40px auto 0;
`

const Home = () => {
    const [showModal, setShowModal] = useState(true)
    const [balanceObj, setBalanceObj] = useState({
        myTomBalance: 0,
        totalSupply: 0
    })

    useEffect(() => {
        getTotalSupply()
            .then(async totalSupply => {
                const myTomBalance = await getTokenBalance(PRESET_TOKEN['TOM2'], await getMetaMaskMyAccount())

                setBalanceObj({
                    myTomBalance: myTomBalance.balance > 0 ? convertDecimal(myTomBalance.balance, myTomBalance.decimals) : 0,
                    totalSupply: totalSupply > 0 ? convertDecimal(totalSupply) : 0,
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div>
                <Helmet>
                    <title>TOMSWAP - HOME</title>
                </Helmet>
                <div className="main_top">
                    <div className="wrapper">
                        <div className="tit">
                            <p className="img"><img src="/images/ico/tom2_logo.png" alt="" /></p>
                            <p className="txt"><img src="/images/ico/ico_tit.png" alt="" /></p>
                            <h3>Stake TOM LP tokens to get TOM2!</h3>
                        </div>
                    </div>
                </div>
                <div id="jsHomeMyBalance" className="main_btm wrapper">
                    <div className="figure">
                        <div className="balance">
                            <p>My TOM2 Balance</p>
                            <strong>{balanceObj.myTomBalance}</strong>
                            {/* <div className="pend">
                            <p>Pending harvest</p>
                            <span>0.00000000</span>
                        </div> */}
                        </div>
                        <div className="supply">
                            <p>Current Total supply</p>
                            <strong>{balanceObj.totalSupply}</strong>
                            {/* <div className="pend">
                            <p>APY</p>
                            <span>10.00000000 TOM2</span>
                        </div> */}
                        </div>
                    </div>
                    <Link to="/farm" className="main_btn">See the Touch of Midas Farm</Link>
                </div>
            </div>
            {showModal ? (
                <div id="will_pop" className="popup_wrap">
                    <div className="popup">
                        <div className="pop_con">
                            <Title className="will">
                                <strong>TOMSWAP TOM2 Mining End</strong>
                            </Title>
                            <DescriptionWrap>
                                <p>TOMSWAP’s TOM2 mining is expected to end soon.</p>
                                <p>Mining start and end schedules are as follows, and the exact time can be checked on the Etherscan block countdown page.</p>
                                <p>* Mining start block: 11,652,418</p>
                                <p>* Mining end block: 12,064,479</p>
                                <p>* etherscan view blocks : <a href="https://etherscan.io/blocks" target="_blank" rel="noreferrer">https://etherscan.io/blocks</a></p>
                                <p>LP tokens deposited in TOMSWAP must be unstaked prior to the end of mining in order to receive the tokens back. We recommend that you unstake with sufficient time, and you are responsible for any losses incurred in this regard.</p>
                            </DescriptionWrap>
                            <CloseBtn onClick={() => setShowModal(false)}>Confirm</CloseBtn>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Home