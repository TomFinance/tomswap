
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { mq } from 'assets/Responsive'
import { ETH_ADDRESS } from 'config'
import TokenListModal from './TokenListModal'
import { positionLocalStorage, convertDecimal } from 'utils/utils'
import { createPreviewPrice, createCheckApprove, createConfirmApprove, createImportCreate, getCheckPairContract, addLiquidityPreview, getTokenBalance, getBalance } from 'utils/web3Utils'
import ConfirmModal from 'Exchange/ConfirmModal'
import LoadingModal from '../LoadingModal'
import { getMetaMaskMyAccount } from 'utils/metaMask'
import { Helmet } from 'react-helmet'
import HelpBox from 'Global/HelpBox'
import { myAccountDispatch, myAccountReducer } from 'contextAPI'
import { numberPattern } from 'utils/utils'

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
    const [myAccount, setMyAccount] = useReducer(myAccountReducer, myAccountDispatch)

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

    const onChangeAddLiquidityInput = (e, state, setState) => {
        const { target: { value: amount } } = e

        if (amount === '') {
            setState({ ...state, amount: '' })
        } else if (convertDecimal(state.balance, state.decimals) >= 0 && numberPattern.test(amount)) {
            setState({ ...state, amount })
        }
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
    }, [addLiquidityInputA.amount, addLiquidityInputA.tokenAddress, addLiquidityInputB.amount, addLiquidityInputB.tokenAddress])

    useEffect(() => {
        checkoutApproved()
    }, [checkoutApproved])

    const checkClacPrice = useCallback(async () => {
        if ((addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress) && (addLiquidityInputA.symbol !== addLiquidityInputB.symbol)) {
            if (addLiquidityInputA.amount > 0) {
                if (pageType === 'add liquidity') {
                    const calcText = await addLiquidityPreview(addLiquidityInputA, addLiquidityInputB)
                    setCalcPricesText(convertDecimal(calcText['3']) > 0
                        ? {
                            left: calcText['0'],
                            center: calcText['1'],
                            right: calcText['2'],
                            receiveToken: calcText['4']
                        } : {
                            left: '',
                            center: '',
                            right: '',
                            receiveToken: ''
                        })
                    setAddLiquidityInputB({
                        ...addLiquidityInputB,
                        amount: convertDecimal(calcText['3']),
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

    const loadingConfirm = async (processFunc, action) => {
        setShowModal({ confirm: false, loading: true })
        try {
            await processFunc()
            positionLocalStorage.setMyPositionList(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress)
            setMyAccount({
                ...myAccount,
                balance: await getBalance(myAccount.address)
            })
            if (action === 'approve') {
                setShowModal({ confirm: false, loading: false, success: false })
            } else {
                setShowModal({ confirm: false, loading: true, success: true })
            }
        } catch (error) {
            switch (error.code) {
                case 4001:
                    setShowModal({ confirm: false, loading: false, success: false })
                    break
                case -32602:
                    if (action === 'approve') {
                        setShowModal({ confirm: false, loading: false, success: false })
                    } else {
                        setShowModal({ confirm: false, loading: true, success: true })
                    }
                    break
                default:
                    setShowModal({ confirm: false, loading: false, success: false })
                    break
            }
        }
    }

    const addLiquidityFromPoolPage = useCallback(
        async position => {
            const myAccount = await getMetaMaskMyAccount()

            setAddLiquidityInputA(await getTokenBalance(position.tokenAddressA, myAccount))
            setAddLiquidityInputB(await getTokenBalance(position.tokenAddressB, myAccount))
        }, [])

    useEffect(() => {
        const data = location.data
        if (data) {
            addLiquidityFromPoolPage(data)
        }
    }, [addLiquidityFromPoolPage, location.data])

    return (
        <>
            <Helmet>
                <title>{`TOMSWAP - ${pageType.toUpperCase()}`}</title>
            </Helmet>
            <Wrapper className="wrapper">
                <div id="jsAddLiquidityPage" className="wrapper">
                    <div className="sub_wrap liqu_wrap">
                        <div className="tit">
                            <Link to="/exchange/pool" className="prev"><img src="/images/ico/ico_arrow_back.png"
                                alt="뒤로가기" /></Link>
                            <span>{pageType === 'add liquidity' ? 'Add Liquidity' : 'Create Pair'}</span>
                            <HelpBox id={10} helpText={'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'} />
                        </div>
                        <div className="exchange">
                            <div className="top">
                                <div className="fl from">
                                    <span>Input</span>
                                    <p>{`Balance : ${convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals)} `}</p>
                                </div>
                                <div className="fr max">
                                    <input id="Create_0_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputA.amount ? addLiquidityInputA.amount : ''} onChange={e => { if (addLiquidityInputA.symbol !== 'Select') onChangeAddLiquidityInput(e, addLiquidityInputA, setAddLiquidityInputA) }} />
                                    <div>
                                        {addLiquidityInputA.amount !== convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) && Number(addLiquidityInputA.balance) ? (
                                            <MaxBtn onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, amount: convertDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) })} >Max</MaxBtn>
                                        ) : null}
                                        <a href="#token_pop" className={`pop_call ${addLiquidityInputA.symbol.toLowerCase()}`} onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, show: true })}>{addLiquidityInputA.symbol}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="btm">
                                <div className="fl">
                                    <span>Input</span>
                                    <p>{`Balance: ${convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals)} `}</p>
                                </div>
                                <div className="fr">
                                    <input id="Create_1_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputB.amount ? addLiquidityInputB.amount : ''} onChange={e => { if (addLiquidityInputB.symbol !== 'Select') onChangeAddLiquidityInput(e, addLiquidityInputB, setAddLiquidityInputB) }} />
                                    <div className="token">
                                        {pageType === 'create pair' && addLiquidityInputB.amount !== convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) && Number(addLiquidityInputB.balance) ? (
                                            <strong onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, amount: convertDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) })} >Max</strong>
                                        ) : null}
                                        <a href="#token_pop" className={`pop_call ${addLiquidityInputA.symbol.toLowerCase()}`} onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, show: true })} >{addLiquidityInputB.symbol}</a>
                                        <ul className="token">
                                            <li><a href="#;">TMTG</a></li>
                                            <li><a href="#;">TMTG</a></li>
                                            <li><a href="#;">TMTG</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {addLiquidityInputA.amount > 0 && addLiquidityInputB.amount > 0 ? (
                            <div className="analy">
                                <div className="route">
                                    <p>Prices and pool share</p>
                                    <ul>
                                        <li>
                                            <span>{convertDecimal(Number(calcPricesText.left))}</span>
                                            <p>{`${addLiquidityInputA.symbol.toUpperCase()} per ${addLiquidityInputB.symbol.toUpperCase()} `}</p>
                                        </li>
                                        <li>
                                            <span>{convertDecimal(Number(calcPricesText.center))}</span>
                                            <p>{`${addLiquidityInputB.symbol.toUpperCase()} per ${addLiquidityInputA.symbol.toUpperCase()} `}</p>
                                        </li>
                                        <li>
                                            <span>{convertDecimal(Number(calcPricesText.right))}%</span>
                                            <p>Share of Pool</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : null}
                        {addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress && (
                            <AppoveBtnWrap>
                                {addLiquidityInputA.tokenAddress !== ETH_ADDRESS && (!checkApprove.a && checkApprove.a !== null) ? (
                                    <AppoveBtn className={`enter enter02 on`} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputA.tokenAddress, addLiquidityInputA); await checkoutApproved(); await checkPairContract() }, 'approve')}>{`Approve ${addLiquidityInputA.symbol.toUpperCase()} `}</AppoveBtn>
                                ) : null}
                                {addLiquidityInputB.symbol !== ETH_ADDRESS && (!checkApprove.b && checkApprove.b !== null) ? (
                                    <AppoveBtn className={`enter enter02 on`} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputB.tokenAddress, addLiquidityInputB); await checkoutApproved(); await checkPairContract() }, 'approve')}>{`Approve ${addLiquidityInputB.symbol.toUpperCase()} `}</AppoveBtn>
                                ) : null}
                            </AppoveBtnWrap>
                        )}
                        <button className={`enter pop_call ${(checkApprove.a && checkApprove.b) && (addLiquidityInputA.amount <= addLiquidityInputA.balance / Math.pow(10, addLiquidityInputA.decimals) && addLiquidityInputB.amount <= addLiquidityInputB.balance / Math.pow(10, addLiquidityInputB.decimals)) ? 'on' : 'disabled'}`} disabled={(!checkApprove.a || !checkApprove.b) && (addLiquidityInputA.amount <= addLiquidityInputA.balance / Math.pow(10, addLiquidityInputA.decimals) || addLiquidityInputB.amount <= addLiquidityInputB.balance / Math.pow(10, addLiquidityInputA.decimals))} onClick={() => setShowModal({ confirm: true, loading: false })} >{pageType === 'add liquidity' ? 'Supply' : 'Create'}</button>
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
                <TokenListModal addLiquidityInput={addLiquidityInputA} setAddLiquidityInput={setAddLiquidityInputA} />
            )}
            {addLiquidityInputB.show && (
                <TokenListModal addLiquidityInput={addLiquidityInputB} setAddLiquidityInput={setAddLiquidityInputB} />
            )}
        </>
    )
}

export default AddLiquidity