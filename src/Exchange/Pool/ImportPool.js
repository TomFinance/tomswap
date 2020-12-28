import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
    padding: 115px 0 538px;
    .sub_wrap {
        margin: 0 auto;
    }
`

const GridBtnWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

const ImportPool = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <div>
            <Wrapper className="wrapper">
                <div className="sub_wrap sub_wrap04">
                    <ul>
                        <li><Link to={'/exchange/swap'}>Swap</Link></li>
                        <li className="on"><a href="#;">Pool</a></li>
                    </ul>
                    <GridBtnWrap>
                        <Link to="/exchange/pool/add-liquidity" className="add_btn">Add Liquidity</Link>
                    </GridBtnWrap>
                    <div className="liquidity">
                        <div className="li_tit">Your Liquidity
							<a href="#;" className="q_ico">
                                <div className="help_box">Find a token…</div>
                            </a>
                        </div>
                        <div id="jsLiquidityBox">
                            {loading ? (
                                <div className="box">
                                    <p className="load_txt">Loading…</p>
                                </div>
                            ) : (
                                    <div className="box box_in">
                                        <div className="loaded_txt">
                                            <p className="etu">
                                                <span className="icon01"><img src="/images/ico/ico_eth01.png"
                                                    alt="" /></span>
                                                <span className="icon02"><img src="/images/ico/ico_eth02.png"
                                                    alt="" /></span>
										ETU/USDT
									</p>
                                            <dl>
                                                <dt>Pooled ETH</dt>
                                                <dd className="eth01">0.001000</dd>
                                                <dt>Pooled USDT</dt>
                                                <dd className="eth02">0.000000</dd>
                                                <dt>Your pool tokens:</dt>
                                                <dd>0.0000001234</dd>
                                                <dt>Your pool share:</dt>
                                                <dd>0.00%</dd>
                                            </dl>
                                        </div>
                                    </div>
                                )}
                            <div className="btns">
                                <a href="#;">View pair analytics</a>
                                <div className="two_btn">
                                    <a href="./add_liquidity.html" className="add">Add</a>
                                    <a href="./remove_liquidity.html" className="remove">Remove</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="join_txt">Don’t see a pool you joined? <em>Import it.</em></p>
                </div>
            </Wrapper>
        </div>
    )
}

export default ImportPool