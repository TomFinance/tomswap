import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { convertDecimal, positionLocalStorage } from 'utils/utils'
import { myPositionCheck } from 'utils/web3Utils'
import { Helmet } from 'react-helmet'
import HelpBox from 'Global/HelpBox'

const Wrapper = styled.div`
    padding: 115px 20px 0;
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

const Pool = () => {
    const [loading, setLoading] = useState(true)
    const [positionList, setPositionList] = useState(null)

    const onClickPosition = (targetPosition, idx) => {
        const tempPositionList = [...positionList]
        tempPositionList[idx] = { ...targetPosition, show: !targetPosition.show }
        setPositionList(tempPositionList)
    }

    const checkPairContract = useCallback(async () => {
        const localStorageSavePositionList = positionLocalStorage.getMyPositionList() || []
        const tempPositionList = await Promise.all(
            localStorageSavePositionList.map(async position => {
                const tokenAddressArr = position.split('_')
                const positionData = await myPositionCheck(tokenAddressArr[0], tokenAddressArr[1])
                return positionData ? {
                    show: false,
                    tokenAddressA: tokenAddressArr[0],
                    tokenAddressB: tokenAddressArr[1],
                    ...positionData
                } : false
            })
        )

        setPositionList(tempPositionList?.filter(positionData => positionData.lpToken && Number(positionData.lpToken) > 0))
        setLoading(false)
    }, [])

    useEffect(() => {
        checkPairContract()
    }, [checkPairContract])

    return (
        <div>
            <Helmet>
                <title>TOM2 FANANCE - POOL</title>
            </Helmet>
            <Wrapper className="wrapper">
                <div className="sub_wrap sub_wrap04">
                    <ul>
                        <li><Link to={'/exchange/swap'}>Swap</Link></li>
                        <li className="on"><Link to={'/exchange/pool'}>Pool</Link></li>
                    </ul>
                    <GridBtnWrap>
                        <Link to="/exchange/pool/add-liquidity" className="add_btn">Add Liquidity</Link>
                    </GridBtnWrap>
                    <div className="liquidity">
                        <div className="li_tit">Your Liquidity
                        <HelpBox helpText={'Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.'} />
                        </div>
                        {(loading || positionList === null) ? (
                            <div className="box">
                                <p className="load_txt">Loading…</p>
                            </div>
                        ) : (
                                <>
                                    {positionList.length > 0 ? (
                                        <>
                                            {positionList?.map((position, idx) => {
                                                return (
                                                    <div key={idx} onClick={() => onClickPosition(position, idx)}>
                                                        <div className="box box_in">
                                                            <div className="loaded_txt">
                                                                <p className="etu">
                                                                    {/* <span className="icon01">
                                                                <img src="/images/ico/ico_eth01.png" alt="" />
                                                            </span>
                                                            <span className="icon02">
                                                                <img src="/images/ico/ico_eth02.png" alt="" />
                                                            </span> */}
                                                                    {`${position.token0Symbol}/${position.token1Symbol}`}</p>
                                                                {position.show && (
                                                                    <dl>
                                                                        <dt>{`Pooled ${position.token0Symbol}`}</dt>
                                                                        <dd>{convertDecimal(position.token0ViewValue)}</dd>
                                                                        <dt>{`Pooled ${position.token1Symbol}`}</dt>
                                                                        <dd>{convertDecimal(position.token1ViewValue)}</dd>
                                                                        <dt>Your pool tokens:</dt>
                                                                        <dd>{convertDecimal(position.lpTokenView)}</dd>
                                                                        <dt>Your pool share:</dt>
                                                                        <dd>{convertDecimal(position.persent * 100)}%</dd>
                                                                    </dl>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {position.show && (
                                                            <div className="btns">
                                                                <div className="two_btn">
                                                                    <Link to={{ pathname: '/exchange/pool/add-liquidity', data: position }} className="add">Add</Link>
                                                                    <Link to={{ pathname: '/exchange/pool/remove-liquidity', data: position }} className="remove">Remove</Link>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </>
                                    ) : (
                                            <div className="box">
                                                <p className="load_txt">No thing</p>
                                            </div>
                                        )}
                                </>
                            )}
                    </div>
                    <p className="join_txt">Don’t see a pool you joined? <Link to={'/exchange/import-pool'}><em>Import it.</em></Link></p>
                </div>

            </Wrapper>
        </div>
    )
}

export default Pool