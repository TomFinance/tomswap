import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { myPositionCheck } from 'utils/web3Utils'
import LiquidityTokenModal from './LiquidityTokenModal'
import { convertDecimal, positionLocalStorage } from 'utils/utils'

const NotFoundBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.found {
        margin-top: 20px;
        & > p:last-of-type {
            font-weight: 500;
            color: #eab640;
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`

const ImportPool = ({ history }) => {
    const [pairData, setPairData] = useState(null)
    const [addLiquidityInputA, setAddLiquidityInputA] = useState({
        name: '',
        symbol: 'Select',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })
    const [addLiquidityInputB, setAddLiquidityInputB] = useState({
        name: '',
        symbol: '',
        balance: '',
        decimals: '',
        totalSupply: '',
        tokenAddress: '',
        show: false
    })

    const checkPairContract = useCallback(async () => {
        if (addLiquidityInputA.tokenAddress && addLiquidityInputB.tokenAddress) {
            setPairData(await myPositionCheck(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress])

    useEffect(() => {
        checkPairContract()
    }, [checkPairContract])

    const onClickManagePool = () => {
        positionLocalStorage.setMyPositionList(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress)
        history.push('/exchange/pool')
    }

    return (
        <>
            <div className="wrapper">
                <div className="sub_wrap liqu_wrap sub_wrap05">
                    <div className="tit">
                        <Link to={'/exchange/pool'} className="prev"><img src="/images/ico/ico_arrow_back.png" alt="뒤로가기" /></Link>
                        <span>Import Pool</span>
                        <a href="#;" className="q_ico">
                            <div className="help_box">Find a token…</div>
                        </a>
                    </div>
                    <div className="import_wrap">
                        <div className="select" onClick={() => setAddLiquidityInputA({ ...addLiquidityInputA, show: true })}>
                            <p className="txt"><a href="#token_pop" className="pop_call">
                                {/* <img src="/images/ico/ico_eth01.png" alt="" /> */}
                                {addLiquidityInputA.symbol}</a>
                            </p>
                            <ul>
                                <li><a href="#;"><img src="/images/ico/ico_eth01.png" alt="" />ETH1</a></li>
                                <li><a href="#;"><img src="/images/ico/ico_eth01.png" alt="" />ETH2</a></li>
                                <li><a href="#;"><img src="/images/ico/ico_eth01.png" alt="" />ETH3</a></li>
                            </ul>
                        </div>
                        <div className="select select02" onClick={() => setAddLiquidityInputB({ ...addLiquidityInputB, show: true })}>
                            <p className="txt"><a href="#token_pop" className="pop_call">{addLiquidityInputB.symbol || 'Select a Token'}</a></p>
                            <ul>
                                <li><a href="#;"><img src="/images/ico/ico_eth02.png" alt="" />USDT1</a></li>
                                <li><a href="#;"><img src="/images/ico/ico_eth02.png" alt="" />USDT2</a></li>
                                <li><a href="#;"><img src="/images/ico/ico_eth02.png" alt="" />USDT3</a></li>
                            </ul>
                        </div>
                    </div>
                    {pairData !== null && (
                        <>
                            {pairData ? (
                                <>
                                    <div className="position">
                                        <p>Your position</p>
                                        <dl>
                                            <dt className="bold etu">
                                                {/* <span className="icon01"><img src="/images/ico/ico_eth01.png" alt="" /></span> */}
                                                {/* <span className="icon02"><img src="/images/ico/ico_eth02.png" alt="" /></span> */}
                                                {` ${addLiquidityInputA.symbol}/${addLiquidityInputB.symbol}`}
                                            </dt>
                                            <dd className="bold">{convertDecimal(pairData.lpToken, pairData.pairDecimals)}</dd>
                                            <dt>{addLiquidityInputA.symbol}</dt>
                                            <dd>{convertDecimal(pairData.token0Value, pairData.token0Decimals, pairData.persent)}</dd>
                                            <dt>{addLiquidityInputB.symbol}</dt>
                                            <dd>{convertDecimal(pairData.token1Value, pairData.token1Decimals, pairData.persent)}</dd>
                                        </dl>
                                    </div>
                                    <NotFoundBox className='found'>
                                        <p>Pool Found!</p>
                                        <p onClick={onClickManagePool}>Manage this pool.</p>
                                    </NotFoundBox>
                                </>
                            ) : (
                                    <NotFoundBox className="position">
                                        <p>Not Found</p>
                                    </NotFoundBox>
                                )}
                        </>
                    )}
                </div>
            </div>
            {addLiquidityInputA.show && (
                <LiquidityTokenModal addLiquidityInput={addLiquidityInputA} setAddLiquidityInput={setAddLiquidityInputA} />
            )}
            {addLiquidityInputB.show && (
                <LiquidityTokenModal addLiquidityInput={addLiquidityInputB} setAddLiquidityInput={setAddLiquidityInputB} />
            )}
        </>
    )
}

export default ImportPool