import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
    padding: 115px 0 538px;
    .sub_wrap {
        margin: 0 auto;
    }
`

const Swap = () => {
    return (
        <div>
            <Wrapper className="wrapper">
                <div className="sub_wrap">
                    <ul>
                        <li className="on"><a href="#;">Swap</a></li>
                        <li><Link to={'/exchange/pool'}>Pool</Link></li>
                    </ul>
                    <div className="exchange">
                        <div className="top">
                            <div className="fl from">
                                <span>from</span>
                                <p>Balance : 0</p>
                            </div>
                            <div className="fr max">
                                <input type="text" placeholder="0.0" />
                                <div>
                                    <a href="#;" className="max_btn">Max</a>
                                    <a href="#token_pop" className="eth pop_call">ETH</a>
                                </div>
                            </div>
                        </div>
                        <div className="btm">
                            <div className="fl">
                                <span>To</span>
                                <p>-</p>
                            </div>
                            <div className="fr">
                                <input type="text" placeholder="0.0" />
                                <div className="token">
                                    <a href="#token_pop" className="pop_call">Select a token</a>
                                    <ul className="token">
                                        <li><a href="#;">token</a></li>
                                        <li><a href="#;">token</a></li>
                                        <li><a href="#;">token</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#;" className="enter">Enter an amount</a>
                </div>
            </Wrapper>
        </div>
    )
}

export default Swap