import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { checkRemoveLiquidityApprove, requestRemoveLiquidityApprove, requestRemoveLiquidity } from 'utils/web3Utils'
import LoadingModal from 'Exchange/LoadingModal'
import { convertDecimal } from 'utils/utils'

const PositionTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > dt {
        margin-bottom: 4px !important;
    }
`

const WarningText = styled.p`
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 32px;
    color: rgb(132, 133, 138);
`

const RemoveLiquidity = ({ history, location }) => {
    const [removeValue, setRemoveValue] = useState('')
    const [myPosition, setMyPosition] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [abledApprove, setAbledApprove] = useState(false)

    const onChangeRemoveValue = e => {
        const targetNumber = Number(e.target.value)

        if ((100 <= targetNumber)) {
            setRemoveValue(100)
        } else if (0 < targetNumber) {
            setRemoveValue(targetNumber)
        } else if (e.target.value === '') {
            setRemoveValue(e.target.value)
        }
    }

    const checkPairApprove = useCallback(async () => {
        if (myPosition !== null && removeValue) {
            setAbledApprove(await checkRemoveLiquidityApprove(myPosition.tokenAddressA, myPosition.tokenAddressB, myPosition.lpToken * (removeValue / 100)))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myPosition, removeValue])

    useEffect(() => {
        checkPairApprove()
    }, [checkPairApprove])

    const onClickApprove = async () => {
        await requestRemoveLiquidityApprove(myPosition.tokenAddressA, myPosition.tokenAddressB, myPosition.lpToken * (removeValue / 100))
        checkPairApprove()
    }

    const onClickRemoveLiquidity = async () => {
        setShowModal(true)
        try {
            await requestRemoveLiquidity(myPosition, (removeValue / 100))
            setShowModal(false)
        } catch (error) {
            setShowModal(false)
        }
    }

    useEffect(() => {
        const data = location.data
        if (data) {
            setMyPosition(data)
        } else {
            history.replace('/exchange/pool')
        }
    }, [history, location.data])

    return (
        <>
            {myPosition !== null && (
                <>
                    <div className="sub_wrap liqu_wrap remove_wrap">
                        <div className="tit">
                            <Link to="/exchange/pool" className="prev">
                                <img src="/images/ico/ico_arrow_back.png" alt="뒤로가기" />
                            </Link>
                            <span>Remove Liquidity</span>
                            <a href="#;" className="q_ico">
                                <div className="help_box">Find a token…</div>
                            </a>
                        </div>
                        <div className="exchange">
                            {/* <p><span className="amount">Amount</span><span className="detail">Detailed</span></p> */}
                            <div className="per_wrap">
                                <input type="text" id="amount" value={removeValue} onChange={onChangeRemoveValue} />
                                <div id="slider_range_min"></div>
                                <ul>
                                    <li onClick={() => setRemoveValue(25)}>25%</li>
                                    <li onClick={() => setRemoveValue(50)}>50%</li>
                                    <li onClick={() => setRemoveValue(75)}>75%</li>
                                    <li onClick={() => setRemoveValue(100)}>Max</li>
                                </ul>
                            </div>
                        </div>
                        <div className="weth">
                            <dl>
                                <dt>{removeValue ? Number(myPosition.token0Value * Math.pow(0.1, myPosition.token0Decimals) * myPosition.persent) * (removeValue / 100) : '-'}</dt>
                                {/* <dd className="ico ico03">ETH</dd> */}
                                <dd className="ico">{myPosition.token0Symbol}</dd>
                                <dt>{removeValue ? Number(myPosition.token1Value * Math.pow(0.1, myPosition.token1Decimals) * myPosition.persent) * (removeValue / 100) : '-'}</dt>
                                {/* <dd className="ico ico04">USDT</dd> */}
                                <dd className="ico">{myPosition.token1Symbol}</dd>
                            </dl>
                            {/* <p>Receive WETH</p> */}
                        </div>
                        <dl className="weth price">
                            <dt>Price:</dt>
                            <dd>{`1 ${myPosition.token0Symbol} = ${(Number(myPosition.token1Value * Math.pow(0.1, myPosition.token1Decimals) * myPosition.persent) / Number(myPosition.token0Value * Math.pow(0.1, myPosition.token0Decimals) * myPosition.persent)).toPrecision(12)} ${myPosition.token1Symbol}`}</dd>
                            <dt></dt>
                            <dd className="shadow">{`1 ${myPosition.token1Symbol} = ${(Number(myPosition.token0Value * Math.pow(0.1, myPosition.token0Decimals) * myPosition.persent) / Number(myPosition.token1Value * Math.pow(0.1, myPosition.token1Decimals) * myPosition.persent)).toPrecision(12)} ${myPosition.token0Symbol}`}</dd>
                        </dl>
                        <WarningText>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</WarningText>
                        <div className="two_btn">
                            <button className={`approve ${abledApprove ? '' : 'on'}`} disabled={abledApprove} onClick={onClickApprove}>Approve</button>
                            <button className={`amount ${abledApprove && removeValue && myPosition ? 'on' : ''}`} disabled={!abledApprove || !removeValue || !myPosition} onClick={onClickRemoveLiquidity}>Enter an amount</button>
                        </div>
                    </div>
                    <div className="position">
                        <p>Your position</p>
                        <dl>
                            <PositionTitle>
                                <dt className="bold etu">
                                    {/* <span className="icon01">
                                    <img src="/images/ico/ico_eth01.png" alt="" />
                                </span>
                                <span className="icon02">
                                    <img src="/images/ico/ico_eth02.png" alt="" />
                                </span> */}
                                    {`${myPosition.token0Symbol}/${myPosition.token1Symbol}`}
                                </dt>
                                <dd className="bold">{convertDecimal(myPosition.lpToken, myPosition.pairDecimals)}</dd>
                            </PositionTitle>
                            <dd className="bold">{ }</dd>
                            <dt>{myPosition.token0Symbol}</dt>
                            <dd>{convertDecimal(myPosition.token0Value, myPosition.token0Decimals, myPosition.persent)}</dd>
                            <dt>{myPosition.token1Symbol}</dt>
                            <dd>{convertDecimal(myPosition.token1Value, myPosition.token1Decimals, myPosition.persent)}</dd>
                        </dl>
                    </div>
                </>
            )}
            {showModal && (
                <LoadingModal init={false} setShowModal={setShowModal} />
            )}
        </>
    )
}

export default RemoveLiquidity