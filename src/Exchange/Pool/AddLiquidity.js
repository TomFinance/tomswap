
import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { mq } from 'assets/Responsive'
import { ETH_ADDRESS } from 'config'
import LiquidityTokenModal from './LiquidityTokenModal'
import { positionLocalStorage, convertDecimal } from 'utils/utils'
import { createPreviewPrice, createCheckApprove, createConfirmApprove, createImportCreate, getCheckPairContract, addLiquidityPreview, getTokenBalance } from 'utils/web3Utils'
import ConfirmModal from 'Exchange/ConfirmModal'
import LoadingModal from '../LoadingModal'
import { getMetaMaskMyAccount } from 'utils/metaMask'
import { Helmet } from 'react-helmet'
import HelpBox from 'Global/HelpBox'

const Wrapper = styled.div`
    padding: 115px 0 0;
    .sub_wrap {
        margin: 0 auto 20px;
    }
    ${mq('xLarge')}{
        padding: 80px 0 0;
    }
`

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

const AppoveBtnWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

const AppoveBtn = styled.button`
    background-color: ${props => props.disabledBtn
        ? '#ddd'
        : 'rgba(234,182,64,0.3)'};
`


const AddLiquidity = ({ location }) => {
    const [pageType, setPageType] = useState('add liquidity')
    const [showModal, setShowModal] = useState({
        confirm: false,
        loading: false,
        success: false,
    })
    const [addLiquidityInputA, setAddLiquidityInputA] = useState({
        name: '',
        symbol: 'Select',
        amount: '',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })
    const [addLiquidityInputB, setAddLiquidityInputB] = useState({
        name: '',
        symbol: 'Select',
        amount: '',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })

    const [calcPricesText, setCalcPricesText] = useState({
        left: '',
        center: '',
        right: '',
        receiveToken: ''
    })
    const [checkApprove, setCheckApprove] = useState({
        a: null,
        b: null
    })

    const initialFunc = () => {
        setPageType('add liquidity')
        setShowModal({
            confirm: false,
            loading: false,
            success: false,
        })
        setAddLiquidityInputA({
            name: '',
            symbol: 'Select',
            amount: '',
            balance: '',
            decimals: '',
            totalSupply: '',
            tokenAddress: '',
            show: false
        })
        setAddLiquidityInputB({
            name: '',
            symbol: 'Select',
            amount: '',
            balance: '',
            decimals: '',
            totalSupply: '',
            tokenAddress: '',
            show: false
        })
        setCalcPricesText({
            left: '',
            center: '',
            right: '',
            receiveToken: ''
        })
        setCheckApprove({
            a: null,
            b: null
        })
    }

    const onChangeAmount = (e, state, setState) => {
        const { target: { value: amount } } = e

        setState({
            ...state,
            amount
        })
    }

    const checkPairContract = useCallback(async () => {
        if (addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress) {
            setPageType(await getCheckPairContract(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress) ? 'add liquidity' : 'create pair')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress])

    useEffect(() => {
        checkPairContract()
    }, [checkPairContract])

    const checkoutApproved = useCallback(async () => {
        if (addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress && addLiquidityInputA.amount && addLiquidityInputB.amount) {
            setCheckApprove({
                a: await createCheckApprove(addLiquidityInputA.tokenAddress, addLiquidityInputA.amount, addLiquidityInputA.decimals),
                b: await createCheckApprove(addLiquidityInputB.tokenAddress, addLiquidityInputB.amount, addLiquidityInputB.decimals),
            })
        } else {
            setCheckApprove({
                a: null,
                b: null,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLiquidityInputA.amount, addLiquidityInputB.amount])

    useEffect(() => {
        checkoutApproved()
    }, [checkoutApproved])

    const checkClacPrice = useCallback(async () => {
        if (addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress) {
            if (addLiquidityInputA.amount) {
                if (pageType === 'add liquidity') {
                    const calcText = await addLiquidityPreview(addLiquidityInputA, addLiquidityInputB)

                    setCalcPricesText({
                        left: calcText['0'],
                        center: calcText['1'],
                        right: calcText['2'],
                        receiveToken: calcText['4']
                    })
                    setAddLiquidityInputB({
                        ...addLiquidityInputB,
                        amount: calcText['3'],
                    })
                } else if (addLiquidityInputB.amount && pageType === 'create pair') {
                    const calcText = await createPreviewPrice(addLiquidityInputA, addLiquidityInputB)

                    setCalcPricesText({
                        left: calcText['0'],
                        center: calcText['1'],
                        right: 100,
                        receiveToken: calcText['4']
                    })
                }
            } else {
                setAddLiquidityInputB({
                    ...addLiquidityInputB,
                    amount: ''
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLiquidityInputA.amount, addLiquidityInputB.amount, addLiquidityInputB.tokenAddress])

    useEffect(() => {
        checkClacPrice()
    }, [checkClacPrice])

    const loadingConfirm = async processFunc => {
        setShowModal({ confirm: false, loading: true })
        try {
            await processFunc()
            positionLocalStorage.setMyPositionList(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress)
            setShowModal({ confirm: false, loading: true, success: true })
        } catch (error) {
            setShowModal({ confirm: false, loading: false, success: false })
        }
    }

    const addLiquidityFromPoolPage = async position => {
        const myAccount = await getMetaMaskMyAccount()

        setAddLiquidityInputA(await getTokenBalance(position.tokenAddressA, myAccount))
        setAddLiquidityInputB(await getTokenBalance(position.tokenAddressB, myAccount))
    }

    useEffect(() => {
        const data = location.data
        if (data) {
            addLiquidityFromPoolPage(data)
        }
    }, [location.data])

    return (
        <>
            <Helmet>
                <title>{`TOM2 FANANCE - ${pageType.toUpperCase()}`}</title>
            </Helmet>
            <Wrapper className="wrapper">
                <div id="jsAddLiquidityPage" className="wrapper">
                    <div className="sub_wrap liqu_wrap">
                        <div className="tit">
                            <Link to="/exchange/pool" className="prev"><img src="/images/ico/ico_arrow_back.png"
                                alt="뒤로가기" /></Link>
                            <span>{pageType === 'add liquidity' ? 'Add Liquidity' : 'Create Pair'}</span>
                            <HelpBox helpText={'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'} />
                        </div>
                        <div className="exchange">
                            <div className="top">
                                <div className="fl from">
                                    <span>Input</span>
                                    <p>{`Balance : ${convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals)} `}</p>
                                </div>
                                <div className="fr max">
                                    <input id="Create_0_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputA.amount} onChange={e => onChangeAmount(e, addLiquidityInputA, setAddLiquidityInputA)} disabled={addLiquidityInputA.symbol === 'Select'} />
                                    <div>
                                        {addLiquidityInputA.amount !== convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) && Number(addLiquidityInputA.balance) ? (
                                            <MaxBtn onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, amount: convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) })} >Max</MaxBtn>
                                        ) : null}
                                        <a href="#token_pop" className="eth pop_call" onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, show: true })}>{addLiquidityInputA.symbol}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="btm">
                                <div className="fl">
                                    <span>Input</span>
                                    <p>{`Balance: ${convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals)} `}</p>
                                </div>
                                <div className="fr">
                                    <input id="Create_1_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputB.amount} onChange={e => onChangeAmount(e, addLiquidityInputB, setAddLiquidityInputB)} disabled={addLiquidityInputB.symbol === 'Select'} />
                                    <div className="token">
                                        {addLiquidityInputB.amount !== convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) && Number(addLiquidityInputB.balance) ? (
                                            <strong onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, amount: convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) })} >Max</strong>
                                        ) : null}
                                        <a href="#token_pop" className="pop_call" onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, show: true })} >{addLiquidityInputB.symbol}</a>
                                        <ul className="token">
                                            <li><a href="#;">TMTG</a></li>
                                            <li><a href="#;">TMTG</a></li>
                                            <li><a href="#;">TMTG</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {addLiquidityInputA.amount && addLiquidityInputB.amount ? (
                            <div className="analy">
                                <div className="route">
                                    <p>Prices and pool share</p>
                                    <ul>
                                        <li>
                                            <span>{Number(calcPricesText.left).toPrecision(12)}</span>
                                            <p>{`${addLiquidityInputA.symbol.toUpperCase()} per ${addLiquidityInputB.symbol.toUpperCase()} `}</p>
                                        </li>
                                        <li>
                                            <span>{Number(calcPricesText.center).toPrecision(12)}</span>
                                            <p>{`${addLiquidityInputB.symbol.toUpperCase()} per ${addLiquidityInputA.symbol.toUpperCase()} `}</p>
                                        </li>
                                        <li>
                                            <span>{Number(calcPricesText.right).toPrecision(12)}%</span>
                                            <p>Share of Pool</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : null}
                        {addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress && (
                            <AppoveBtnWrap>
                                {addLiquidityInputA.tokenAddress !== ETH_ADDRESS && (
                                    <AppoveBtn className={`enter enter02 ${(checkApprove.a || checkApprove.a === null) ? 'disabled' : 'on'}`} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputA.tokenAddress, addLiquidityInputA.amount, addLiquidityInputA.decimals); await checkPairContract() })}>{`Approve ${addLiquidityInputA.symbol.toUpperCase()} `}</AppoveBtn>
                                )}
                                {addLiquidityInputB.symbol !== ETH_ADDRESS && (
                                    <AppoveBtn className={`enter enter02 ${(checkApprove.b || checkApprove.b === null) ? 'disabled' : 'on'}`} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputB.tokenAddress, addLiquidityInputB.amount, addLiquidityInputB.decimals); await checkPairContract() })}>{`Approve ${addLiquidityInputB.symbol.toUpperCase()} `}</AppoveBtn>
                                )}
                            </AppoveBtnWrap>
                        )}
                        <button className={`enter pop_call ${(checkApprove.a && checkApprove.b) && (addLiquidityInputA.amount <= addLiquidityInputA.balance * Math.pow(0.1, addLiquidityInputA.decimals) && addLiquidityInputB.amount <= addLiquidityInputB.balance * Math.pow(0.1, addLiquidityInputB.decimals)) ? 'on' : 'disabled'}`} disabled={(!checkApprove.a || !checkApprove.b) && (addLiquidityInputA.amount <= addLiquidityInputA.balance * Math.pow(0.1, addLiquidityInputA.decimals) || addLiquidityInputB.amount <= addLiquidityInputB.balance * Math.pow(0.1, addLiquidityInputA.decimals))} onClick={() => setShowModal({ confirm: true, loading: false })} >{pageType === 'add liquidity' ? 'Supply' : 'Create'}</button>
                    </div>
                </div>
            </Wrapper>
            {showModal.confirm && (
                <ConfirmModal aToken={addLiquidityInputA} bToken={addLiquidityInputB} calcData={calcPricesText} closeFunc={() => setShowModal({ ...showModal, confirm: false })} confirmFunc={() => loadingConfirm(async () => await createImportCreate(addLiquidityInputA, addLiquidityInputB))} />
            )}
            {showModal.loading && (
                <LoadingModal init={{ confirm: false, loading: false, success: false }} showModal={showModal} setShowModal={setShowModal} initialFunc={initialFunc} />
            )}
            {addLiquidityInputA.show && (
                <LiquidityTokenModal addLiquidityInput={addLiquidityInputA} setAddLiquidityInput={setAddLiquidityInputA} />
            )}
            {addLiquidityInputB.show && (
                <LiquidityTokenModal addLiquidityInput={addLiquidityInputB} setAddLiquidityInput={setAddLiquidityInputB} />
            )}
        </>
    )
}

export default AddLiquidity