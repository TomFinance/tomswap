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

const ButtonWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
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
                                <strong>TOM2 Mining C-BANK Airdrop Event</strong>
                            </Title>
                            <DescriptionWrap>
                                <p>Event content</p>
                                <p>-Airdrop to 100 million C-BANK, TOM2 miners in total</p>
                                <p>-Payment settlement after mining</p>
                                <p>-Payment in installments for 300 days of C-BANK 6 months from the date of payment</p>
                                <p>How to receive C-BANK</p>
                                <p>-Application period C-BANK Airdrop Fill out Google form and submit</p>
                                <p>-Reception period: March 19 (Fri) ~ 29 (Mon)</p>
                                <p>-Payment date: April 1 (Thursday)</p>
                                <p>-Contents of Google Form: Wallet address that participated in Tom 2 mining, COINZEUS account, TOM2 mining capture screen</p>
                                <p>-Notes: C-BANK withdrawal is possible 6 months after payment is received. Payment will not be made if the Google form is not submitted within the application period.</p>
                            </DescriptionWrap>
                            <ButtonWrap>
                                <CloseBtn onClick={() => window.open('https://forms.gle/RbxDCRtqPA5DG7H38')}>Create Google Form</CloseBtn>
                                <CloseBtn onClick={() => setShowModal(false)}>Cancel</CloseBtn>
                            </ButtonWrap>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Home