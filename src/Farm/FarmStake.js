import React, { useCallback, useEffect, useState } from 'react'
import { MINING_POOLS } from 'config'
import { checkTom2PoolApprove, getMyLpTokenBalance, confirmLpTokenApprove, lpTokenRequestTx } from 'utils/web3Utils'
import StakeModal from './StakeModal'
import styled from '@emotion/styled'
import LoadingModal from 'Exchange/LoadingModal'
import { convertDecimal } from 'utils/utils'

const StakeButtonWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

const FarmStake = ({ match: { params: { route } }, history }) => {
    const [showModal, setShowModal] = useState({
        stake: false,
        unStake: false,
        loading: false,
        success: false,
    })
    const [splitPoolNameObj, setSplitPoolNameObj] = useState({
        lpTokenSymbol: '',
        aTokenName: '',
        bTokenName: '',
    })

    const [stakeData, setStakeData] = useState({
        tom2Amount: '',
        stakedToken: '',
        lpTokenBalance: '',
        lpTokenDecimals: '',
        lpTokenAllowance: null
    })

    const initialFunc = async () => {
        await getPoolInfo()
        setShowModal({
            stake: false,
            unStake: false,
            loading: false,
            success: false,
        })
    }

    const getPoolInfo = useCallback(async () => {
        if (splitPoolNameObj.aTokenName !== '' && splitPoolNameObj.bTokenName !== '') {
            setStakeData({
                ...stakeData,
                ...await checkTom2PoolApprove(splitPoolNameObj.lpTokenSymbol),
                ...await getMyLpTokenBalance(splitPoolNameObj.lpTokenSymbol)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [splitPoolNameObj.aTokenName, splitPoolNameObj.bTokenName])

    useEffect(() => {
        getPoolInfo()
    }, [getPoolInfo])

    const handleLpTokenRequestTx = async processFunc => {
        setShowModal({ ...showModal, stake: false, unStake: false, loading: true })
        try {
            await processFunc()
            setShowModal({ stake: false, unStake: false, loading: true, success: true })
        } catch (error) {
            switch (error.code) {
                case 4001:
                    setShowModal({ stake: false, unStake: false, loading: false, success: false })
                    break
                case -32602:
                    setShowModal({ stake: false, unStake: false, loading: true, success: true })
                    break
                default:
                    setShowModal({ stake: false, unStake: false, loading: false, success: false })
                    break
            }
        }
    }

    useEffect(() => {
        const splitPoolNameList = route.split('-')
        if (splitPoolNameList.length < 2 && !Object.keys(MINING_POOLS).includes(`${splitPoolNameList[0].toUpperCase()}-${splitPoolNameList[1].toUpperCase()}`)) {
            history.replace('/farm')
        } else if (splitPoolNameList.length === 2) {
            setSplitPoolNameObj({
                lpTokenSymbol: `${splitPoolNameList[0].toUpperCase()}-${splitPoolNameList[1].toUpperCase()}`,
                aTokenName: splitPoolNameList[0],
                bTokenName: splitPoolNameList[1],
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, route])

    return (
        <>
            <div id="container" className="stack">
                <div className="main_top">
                    <div className="wrapper">
                        <div className="tit">
                            <p className="img"><img src="/images/ico/ico_main.png" alt="" /></p>
                            <p className="txt txt03"><img src={`/images/ico/${splitPoolNameObj.aTokenName}_${splitPoolNameObj.bTokenName}.png`} alt="" /></p>
                            <h3>{`Every time you stake and unstake LP tokens,`}<br />{`the contract will automagically harvest TOM rewards for you!`}</h3>
                        </div>
                    </div>
                </div>
                <div className="main_btm">
                    <div className="figure">
                        <div className="tom2">
                            <p>{convertDecimal(stakeData.tom2Amount, 18)}</p>
                            <span>TOM2</span>
                            <button className={`main_btn pop_call ${Number(stakeData.tom2Amount) > 0 ? '' : 'disabled'}`} onClick={() => handleLpTokenRequestTx(() => lpTokenRequestTx(splitPoolNameObj.lpTokenSymbol, 'claim'))}>Harvest</button>
                        </div>
                        <div className={`${splitPoolNameObj.aTokenName}-${splitPoolNameObj.bTokenName}`}>
                            <p>{convertDecimal(stakeData.stakedToken, stakeData.lpTokenDecimals)}</p>
                            <span>{`Desposit ${`${splitPoolNameObj.aTokenName.toUpperCase()}-${splitPoolNameObj.bTokenName.toUpperCase()}`} tomswap LP Staked`}</span>
                            {stakeData.lpTokenAllowance ? (
                                <StakeButtonWrap>
                                    <button className={`main_btn pop_call ${Number(stakeData.lpTokenBalance) > 0 ? '' : 'disabled'}`} onClick={() => setShowModal({ ...showModal, stake: true })}>Stake</button>
                                    <button className={`main_btn pop_call ${Number(stakeData.stakedToken) > 0 ? '' : 'disabled'}`} onClick={() => setShowModal({ ...showModal, unStake: true })}>Unstake</button>
                                </StakeButtonWrap>
                            ) : (
                                    <button className={`main_btn pop_call ${stakeData.lpTokenAllowance === null && 'disabled'}`} onClick={() => handleLpTokenRequestTx(() => confirmLpTokenApprove(splitPoolNameObj.lpTokenSymbol))}>Approve</button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {(showModal.stake || showModal.unStake) && (
                <StakeModal splitPoolNameObj={splitPoolNameObj} stakeData={stakeData} showModal={showModal} setShowModal={setShowModal} handleLpTokenRequestTx={handleLpTokenRequestTx} />
            )}
            {showModal.loading && (
                <LoadingModal init={{ stake: false, unStake: false, loading: false, success: false }} showModal={showModal} setShowModal={setShowModal} initialFunc={initialFunc} />
            )}
        </>
    )
}

export default FarmStake