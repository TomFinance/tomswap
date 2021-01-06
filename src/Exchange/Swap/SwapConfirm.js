import HelpBox from 'Global/HelpBox'
import React, { useState } from 'react'

const SwapConfirm = ({ tokenA, tokenB, calcSwapData, showModal, setShowModal, onClickSwap }) => {
    const [clacShow, setClacShow] = useState(true)

    return (
        <>
            <div className="swap_bg"></div>
            <div className="analy anlay_z swap">
                <div className="swap_pop">
                    <h3>Confirm Swap</h3>
                    <div className="wet">
                        <dl>
                            <dt className="arrow">{Number(tokenA.amount).toPrecision(12)}</dt>
                            <dd>{tokenA.symbol}</dd>
                            <dt>{Number(tokenB.amount).toPrecision(12)}</dt>
                            <dd>{tokenB.symbol}</dd>
                        </dl>
                        {/* <p className="up">Price Updated<a href="#;" className="accept">Accept</a></p> */}
                        <span className="txt">{`Output is estimated. You will receive at least ${calcSwapData.minimumReceived} ${tokenB.symbol} or the transaction will revert.`}</span>
                    </div>
                    <button className="swap_close" onClick={() => setShowModal({ ...showModal, confirm: false })}>닫기</button>
                </div>
                <dl>
                    <dt className="mark">Price</dt>
                    {clacShow ? (
                        <dd>{`${calcSwapData.tokenPriceA.toPrecision(12)} ${tokenA.symbol} / ${tokenB.symbol}`}<button className="re_ico" onClick={() => setClacShow(false)}> </button></dd>
                    ) : (
                            <dd>{`${calcSwapData.tokenPriceB.toPrecision(12)} ${tokenB.symbol} / ${tokenA.symbol}`}<button className="re_ico" onClick={() => setClacShow(true)}> </button></dd>
                        )}
                    <dt>Minimum received
                    <HelpBox id={4} helpText={'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'} />
                    </dt>
                    <dd>{`${calcSwapData.minimumReceived.toPrecision(12)} ${tokenB.symbol}`}</dd>
                    <dt>Price Impact
                    <HelpBox id={5} helpText={'The difference between the market price and estimated price due to trade size.'} />
                    </dt>
                    <dd className="green">
                        {`${(calcSwapData.impactRate * 100).toPrecision(12)}%`}</dd>
                    <dt>Liquidity Provider Fee
                    <HelpBox id={6} helpText={'A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive.'} />
                    </dt>
                    <dd>{`${tokenA.amount * 0.003} ${tokenA.symbol}`}</dd>
                </dl>
                <button className="swap_btn on" onClick={onClickSwap}>Confirm Swap</button>
            </div>
        </>
    )
}

export default SwapConfirm