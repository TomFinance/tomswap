import React, { useCallback, useEffect, useReducer, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { checkRemoveLiquidityApprove, requestRemoveLiquidityApprove, requestRemoveLiquidity, getBalance } from 'utils/web3Utils'
import LoadingModal from 'Exchange/LoadingModal'
import HelpBox from 'Global/HelpBox'
import { myAccountDispatch, myAccountReducer } from 'contextAPI'
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
    const [myAccount, setMyAccount] = useReducer(myAccountReducer, myAccountDispatch)

    const [removeValue, setRemoveValue] = useState('1')
    const [myPosition, setMyPosition] = useState(null)
    const [showModal, setShowModal] = useState({
        loading: false,
        success: false
    })
    const [abledApprove, setAbledApprove] = useState(null)

    const initialFunc = () => {
        history.replace('/exchange/pool')
    }

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

    const onClickRemoveLiquidity = async (processFunc, action) => {
        setShowModal({
            ...showModal,
            loading: true,
        })
        try {
            await processFunc()
            setMyAccount({
                ...myAccount,
                balance: await getBalance(myAccount.address)
            })
            if (action === 'approve') {
                setShowModal({ loading: false, success: false })
            } else {
                setShowModal({ loading: true, success: true })
            }
        } catch (error) {
            switch (error.code) {
                case 4001:
                    setShowModal({ loading: false, success: false })
                    break
                case -32602:
                    setShowModal({ loading: true, success: true })
                    break
                default:
                    setShowModal({ loading: false, success: false })
                    break
            }
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
                            <HelpBox helpText={'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'} />
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
                                <dt>{removeValue ? convertDecimal(myPosition.token0ViewValue * (removeValue / 100)) : '-'}</dt>
                                {/* <dd className="ico ico03">ETH</dd> */}
                                <dd className="ico">{myPosition.token0Symbol}</dd>
                                <dt>{removeValue ? convertDecimal(myPosition.token1ViewValue * (removeValue / 100)) : '-'}</dt>
                                {/* <dd className="ico ico04">USDT</dd> */}
                                <dd className="ico">{myPosition.token1Symbol}</dd>
                            </dl>
                            {/* <p>Receive WETH</p> */}
                        </div>
                        <dl className="weth price">
                            <dt>Price:</dt>
                            <dd>{`1 ${myPosition.token0Symbol} = ${convertDecimal(myPosition.token1ViewValue / myPosition.token0ViewValue)} ${myPosition.token1Symbol}`}</dd>
                            <dt></dt>
                            <dd className="shadow">{`1 ${myPosition.token1Symbol} = ${convertDecimal(myPosition.token0ViewValue / myPosition.token1ViewValue)} ${myPosition.token0Symbol}`}</dd>
                        </dl>
                        <WarningText>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</WarningText>
                        <div className="two_btn">
                            <button className={`approve ${(abledApprove !== null && abledApprove) ? 'disabled' : 'on'}`} onClick={() => onClickRemoveLiquidity(() => onClickApprove(), 'approve')}>Approve</button>
                            <button className={`amount ${abledApprove && removeValue && myPosition ? 'on' : 'disabled'}`} onClick={() => onClickRemoveLiquidity(() => requestRemoveLiquidity(myPosition, (removeValue / 100)))}>{abledApprove && removeValue && myPosition ? 'Remove' : 'Enter an amount'}</button>
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
                                <dd className="bold">{convertDecimal(myPosition.lpTokenView)}</dd>
                            </PositionTitle>
                            <dd className="bold">{ }</dd>
                            <dt className={`${myPosition.token0Symbol.toLowerCase()}`}>{myPosition.token0Symbol}</dt>
                            <dd>{convertDecimal(myPosition.token0ViewValue)}</dd>
                            <dt className={`${myPosition.token1Symbol.toLowerCase()}`}>{myPosition.token1Symbol}</dt>
                            <dd>{convertDecimal(myPosition.token1ViewValue)}</dd>
                        </dl>
                    </div>
                </>
            )}
            {showModal.loading && (
                <LoadingModal init={{ loading: false, success: false }} initialFunc={initialFunc} showModal={showModal} setShowModal={setShowModal} />
            )}
        </>
    )
}

export default RemoveLiquidity