
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import LoadingModal from '../LoadingModal'
import TokenListModal from '../Pool/TokenListModal'
import SwapConfirm from './SwapConfirm'
import { getBalance, swapPreviewPrice, swapRequestTx } from 'utils/web3Utils'
import { convertDecimal } from 'utils/utils'
import { Helmet } from 'react-helmet'
import HelpBox from 'Global/HelpBox'
import { myAccountDispatch, myAccountReducer } from 'contextAPI'

const MaxBtn = styled.strong`
    display: inline-block;
    width: 30px;
    height: 20px;
    margin: 3px 6px 0 0;
    color: #eab645;
    font-size: 10px;
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
    cursor: pointer;
    background: rgba(234,182,64,0.2);
`


const Swap = () => {
    const [myAccount, setMyAccount] = useReducer(myAccountReducer, myAccountDispatch)

    const [showModal, setShowModal] = useState({
        reversePrice: false,
        confirm: false,
        loading: false,
        success: false
    })
    const [tokenA, setTokenA] = useState({
        name: '',
        symbol: 'Select',
        amount: '',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })
    const [tokenB, setTokenB] = useState({
        name: '',
        symbol: 'Select',
        amount: '',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })
    const [calcSwapData, setCalcSwapData] = useState(null)

    const initialFunc = () => {
        setShowModal({
            reversePrice: false,
            confirm: false,
            loading: false,
            success: false
        })
        setTokenA({
            name: '',
            symbol: 'Select',
            amount: '',
            balance: '',
            decimals: '',
            totalSupply: '',
            tokenAddress: '',
            show: false
        })
        setTokenB({
            name: '',
            symbol: 'Select',
            amount: '',
            balance: '',
            decimals: '',
            totalSupply: '',
            tokenAddress: '',
            show: false
        })
        setCalcSwapData(null)
    }

    const onChangeAmount = (e, state, setState) => {
        const { target: { value: amount } } = e

        if (amount === '') {
            setTokenA({ ...tokenA, amount: '' })
            setTokenB({ ...tokenB, amount: '' })
        } else {
            setState({
                ...state,
                amount
            })
        }

    }

    const swapPreview = useCallback(async () => {
        if (tokenA.tokenAddress && tokenB.tokenAddress && tokenA.symbol !== 'TOM2' && tokenB.symbol !== 'TOM2') {
            if (tokenA.amount > 0) {
                const calcText = await swapPreviewPrice(tokenA, tokenB)

                if (calcText) {
                    setTokenB({
                        ...tokenB,
                        amount: convertDecimal(calcText.amount)
                    })
                    setCalcSwapData(convertDecimal(calcText.amount) > 0 ? calcText : false)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenA.amount, tokenA.tokenAddress, tokenB.tokenAddress])

    useEffect(() => {
        swapPreview()
    }, [swapPreview])

    const onClickSwap = async () => {
        setShowModal({ showModal, loading: true })
        try {
            await swapRequestTx(tokenA, tokenB)
            setMyAccount({
                ...myAccount,
                balance: await getBalance(myAccount.address)
            })
            setShowModal({ showModal, loading: true, success: true })
        } catch (error) {
            switch (error.code) {
                case 4001:
                    setShowModal({ showModal, loading: false })
                    break
                case -32602:
                    setShowModal({ showModal, loading: true, success: true })
                    break
                default:
                    setShowModal({ showModal, loading: false })
                    break
            }
        }
    }

    return (
        <div className="wrapper">
            <Helmet>
                <title>TOM2 FANANCE - SWAP</title>
            </Helmet>
            <div className="sub_wrap sub_wrap03">
                <ul>
                    <li className="on"><Link to={'/exchange/swap'}>Swap</Link></li>
                    <li><Link to={'/exchange/pool'}>Pool</Link></li>
                </ul>
                <div className="exchange">
                    <div className="top">
                        <div className="fl from">
                            <span>from</span>
                            <p>{`Balance : ${convertDecimal(tokenA.balance, tokenA.decimals)} `}</p>
                        </div>
                        <div className="fr max">
                            <input id="Create_0_Preview" type="text" placeholder={'0.0'} value={tokenA.amount} onChange={e => onChangeAmount(e, tokenA, setTokenA)} disabled={tokenA.symbol === 'Select'} />
                            <div>
                                {tokenA.amount !== convertDecimal(tokenA.balance, tokenA.decimals) && Number(tokenA.balance) ? (
                                    <MaxBtn onClick={() => setTokenA({ ...tokenA, amount: convertDecimal(tokenA.balance, tokenA.decimals) })} >Max</MaxBtn>
                                ) : null}
                                <a href="#token_pop" className={`pop_call ${tokenA.symbol.toLocaleLowerCase()}`} onClick={() => setTokenA({ ...tokenA, show: true })}>{tokenA.symbol}</a>
                            </div>
                        </div>
                    </div>
                    <div className="btm">
                        <div className="fl">
                            <span>To</span>
                            <p>{`Balance : ${convertDecimal(tokenB.balance, tokenB.decimals)} `}</p>
                        </div>
                        <div className="fr">
                            <input id="Create_1_Preview" type="text" placeholder={'0.0'} defaultValue={tokenB.amount} readOnly />
                            <div className="token">
                                <a href="#token_pop" className="pop_call" onClick={() => setTokenB({ ...tokenB, show: true })} >{tokenB.symbol}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="re_price">
                    <span>Price</span>
                    {calcSwapData !== null && (
                        <>
                            {showModal.reversePrice ? (
                                <p>{`${calcSwapData.tokenPriceB} ${tokenB.symbol} per ${tokenA.symbol}`}<a href="#;" className="re_ico" onClick={() => setShowModal({ ...showModal, reversePrice: false })}> </a></p>
                            ) : (
                                    <p>{`${calcSwapData.tokenPriceA} ${tokenA.symbol} per ${tokenB.symbol}`}<a href="#;" className="re_ico" onClick={() => setShowModal({ ...showModal, reversePrice: true })}> </a></p>
                                )}
                        </>
                    )}
                </div>
                {tokenA.symbol !== 'TOM2' && tokenB.symbol !== 'TOM2' && (
                    <button className={`enter enter02 ${(tokenA.amount && tokenB.amount) && (tokenA.amount <= tokenA.balance / Math.pow(10, tokenA.decimals)) && calcSwapData ? 'on' : 'disabledz'}`} onClick={() => setShowModal({ ...showModal, confirm: true })}>{calcSwapData || calcSwapData === null ? 'Swap' : 'There is no pair pool'}</button>
                )}
            </div>
            {tokenA.amount && tokenB.amount && calcSwapData !== null ? (
                <div className="analy">
                    <dl>
                        {/* <dt className="mark">Price</dt>
                        <dd>605.00 USDT / ETH <a href="#;" className="re_ico"> </a></dd> */}
                        <dt>Minimum received
                            <HelpBox id={1} helpText={'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'} />
                        </dt>
                        <dd>{`${convertDecimal(calcSwapData.minimumReceived)} ${tokenB.symbol}`}</dd>
                        <dt>Price Impact
                        <HelpBox id={2} helpText={'The difference between the market price and estimated price due to trade size.'} />
                        </dt>
                        <dd className="green">
                            {`${convertDecimal(calcSwapData.impactRate * 100)}%`}</dd>
                        <dt>Liquidity Provider Fee
                        <HelpBox id={3} helpText={'A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive.'} />
                        </dt>
                        <dd>{`${convertDecimal(tokenA.amount * 0.003)} ${tokenA.symbol}`}</dd>
                    </dl>
                    {/* <div className="route">
                        <p>route</p>
                        <ul>
                            <li><span>WETH</span></li>
                            <li><span>WETH</span></li>
                            <li><span>WETH</span></li>
                        </ul>
                        <a href="#;">View pair analytics</a>
                    </div> */}
                </div>
            ) : null}
            {showModal.confirm && (
                <SwapConfirm tokenA={tokenA} tokenB={tokenB} calcSwapData={calcSwapData} showModal={showModal} setShowModal={setShowModal} onClickSwap={onClickSwap} />
            )}
            {showModal.loading && (
                <LoadingModal init={{ reversePrice: false, confirm: false, loading: false, success: false }} initialFunc={initialFunc} showModal={showModal} setShowModal={setShowModal} />
            )}
            {tokenA.show && (
                <TokenListModal addLiquidityInput={tokenA} setAddLiquidityInput={setTokenA} />
            )}
            {tokenB.show && (
                <TokenListModal addLiquidityInput={tokenB} setAddLiquidityInput={setTokenB} />
            )}
        </div>
    )
}

export default Swap