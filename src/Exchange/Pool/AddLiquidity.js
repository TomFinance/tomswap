
import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { mq } from 'assets/Responsive'
import LiquidityTokenModal from './LiquidityTokenModal'
import { accountLocalStorage, conventDecimal } from 'utils/utils'
import { createPreviewPrice, createCheckApprove, createConfirmApprove, createImportCreate, getCheckPairContract, addLiquidityPreview, getTokenBalance } from 'utils/web3Utils'
import ConfirmModal from 'Exchange/ConfirmModal'
import LoadingModal from '../LoadingModal'

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
        ? '#ddd !important'
        : 'rgba(234,182,64,0.3) !important'};
`

const CreateBtn = styled.button`
    background-color: ${props => props.disabledBtn
        ? 'rgba(234,182,64,0.2) !important'
        : '#eab640 !important'};
`

const AddLiquidity = () => {
    const [pageType, setPageType] = useState('add liquidity')
    const [showModal, setShowModal] = useState({
        confirm: false,
        loading: false,
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
        right: ''
    })
    const [checkApprove, setCheckApprove] = useState({
        a: true,
        b: true
    })

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
                        right: calcText['2']
                    })
                    setAddLiquidityInputB({
                        ...addLiquidityInputB,
                        amount: calcText['3']
                    })
                } else if (addLiquidityInputB.amount && pageType === 'create pair') {
                    const calcText = await createPreviewPrice(addLiquidityInputA, addLiquidityInputB)

                    setCalcPricesText({
                        left: calcText['0'],
                        center: calcText['1'],
                        right: '100.00%'
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

            const myAccountAddress = accountLocalStorage.getMyAccountAddress()

            const resultA = await getTokenBalance(addLiquidityInputA.tokenAddress, myAccountAddress)
            const resultB = await getTokenBalance(addLiquidityInputB.tokenAddress, myAccountAddress)

            setAddLiquidityInputA({
                ...resultA,
                amount: '',
            })

            setAddLiquidityInputB({
                ...resultB,
                amount: '',
            })

            setShowModal({ confirm: false, loading: false })
        } catch (error) {
            setShowModal({ confirm: false, loading: false })
        }
    }

    return (
        <>
            <Wrapper className="wrapper">
                <div id="jsAddLiquidityPage" className="wrapper">
                    <div className="sub_wrap liqu_wrap">
                        <div className="tit">
                            <Link to="/exchange/pool" className="prev"><img src="/images/ico/ico_arrow_back.png"
                                alt="뒤로가기" /></Link>
                            <span>{pageType === 'add liquidity' ? 'Add Liquidity' : 'Create Pair'}</span>
                            <a href="#;" className="q_ico">
                                <div className="help_box">Find a token…</div>
                            </a>
                        </div>
                        <div className="exchange">
                            <div className="top">
                                <div className="fl from">
                                    <span>Input</span>
                                    <p>{`Balance : ${conventDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals)
                                        } `}</p>
                                </div>
                                <div className="fr max">
                                    <input id="Create_0_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputA.amount} onChange={e => onChangeAmount(e, addLiquidityInputA, setAddLiquidityInputA)} disabled={addLiquidityInputA.symbol === 'Select'} />
                                    <div>
                                        {addLiquidityInputA.amount !== conventDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) && Number(addLiquidityInputA.balance) ? (
                                            <MaxBtn onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, amount: conventDecimal(addLiquidityInputA.balance, addLiquidityInputA.decimals) })} >Max</MaxBtn>
                                        ) : null}
                                        <a href="#token_pop" className="eth pop_call" onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, show: true })}>{addLiquidityInputA.symbol}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="btm">
                                <div className="fl">
                                    <span>Input</span>
                                    <p>{`Balance: ${conventDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals)} `}</p>
                                </div>
                                <div className="fr">
                                    <input id="Create_1_Preview" type="text" placeholder={'0.0'} value={addLiquidityInputB.amount} onChange={e => onChangeAmount(e, addLiquidityInputB, setAddLiquidityInputB)} disabled={addLiquidityInputB.symbol === 'Select'} />
                                    <div className="token">
                                        {addLiquidityInputB.amount !== conventDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) && Number(addLiquidityInputB.balance) ? (
                                            <strong onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, amount: conventDecimal(addLiquidityInputB.balance, addLiquidityInputB.decimals) })} >Max</strong>
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
                        {addLiquidityInputA.amount && addLiquidityInputB.amount && (
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
                        )}
                        {addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress && (
                            <AppoveBtnWrap>
                                {addLiquidityInputA.symbol !== 'ETH' && (
                                    <AppoveBtn className={`enter enter02`} disabledBtn={checkApprove.a} disabled={checkApprove.a} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputA.tokenAddress, addLiquidityInputA.amount, addLiquidityInputA.decimals); await checkPairContract() })}>{`Approve ${addLiquidityInputA.symbol.toUpperCase()} `}</AppoveBtn>
                                )}
                                {addLiquidityInputB.symbol !== 'ETH' && (
                                    <AppoveBtn className={`enter enter02`} disabledBtn={checkApprove.b} disabled={checkApprove.b} onClick={() => loadingConfirm(async () => { await createConfirmApprove(addLiquidityInputB.tokenAddress, addLiquidityInputB.amount, addLiquidityInputB.decimals); await checkPairContract() })}>{`Approve ${addLiquidityInputB.symbol.toUpperCase()} `}</AppoveBtn>
                                )}
                            </AppoveBtnWrap>
                        )}
                        <CreateBtn className="enter on pop_call" disabledBtn={!checkApprove.a || !checkApprove.b} disabled={!checkApprove.a || !checkApprove.b} onClick={() => setShowModal({ confirm: true, loading: false })} >{pageType === 'add liquidity' ? 'Supply' : 'Create'}</CreateBtn>
                    </div>
                    {/* <div className="position">
                        <p>Your position</p>
                        <dl>
                            <dt className="bold etu">
                                <span className="icon01"><img src="/images/ico/ico_eth01.png" alt="" /></span>
                                <span className="icon02"><img src="/images/ico/ico_eth02.png" alt="" /></span>
                                ETH/USDT
                            </dt>
                            <dd className="bold">0</dd>
                            <dt>ETH</dt>
                            <dd>0</dd>
                            <dt>USDT</dt>
                            <dd>0</dd>
                        </dl>
                    </div> */}
                </div>
            </Wrapper>
            {showModal.confirm && (
                <ConfirmModal aToken={addLiquidityInputA} bToken={addLiquidityInputB} calcData={calcPricesText} confirmFunc={() => loadingConfirm(async () => await createImportCreate(addLiquidityInputA, addLiquidityInputB))} />
            )}
            {showModal.loading && (
                <LoadingModal init={{ confirm: false, loading: false }} setShowModal={setShowModal} />
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