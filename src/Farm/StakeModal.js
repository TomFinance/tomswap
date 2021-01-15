import React, { useState } from 'react'
import styled from '@emotion/styled'
import { convertDecimal, numberPattern } from 'utils/utils'
import { lpTokenRequestTx } from 'utils/web3Utils'

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const DescriptionWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const InputBox = styled.div`
    position: relative;
    border-radius: 27px;
    margin-top: 20px;
    width: 100%;
    height: 54px;
    background-color: rgba(244, 244, 244, 0.7);
    & > input {
        width: 100%;
        height: 54px;
        border: none;
        padding: 12px 104px 12px 24px;
        background-color: transparent;
    }
    & > button {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 80px;
        height: 30px;
        line-height: 30px;
    }
`

const ButtonWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    & > button:first-of-type {
        background-color: #141414 !important;
    }
`

const StakeModal = ({ splitPoolNameObj, stakeData, showModal, setShowModal, handleLpTokenRequestTx }) => {
    const [amount, setAmount] = useState('')
    const [fakeAmount, setFakeAmount] = useState('')

    const onChange = (e, action) => {
        const { target: { value } } = e

        if (value === '') {
            setAmount('')
            setFakeAmount('')
        } else {
            if (action === 'stake') {
                if (convertDecimal(stakeData.lpTokenBalance, stakeData.lpTokenDecimals) >= 0 && numberPattern.test(value)) {
                    setAmount(value)
                    setFakeAmount(value)
                }
            } else if (action === 'unStake') {
                if (convertDecimal(stakeData.stakedToken, stakeData.lpTokenDecimals) >= 0 && numberPattern.test(value)) {
                    setAmount(value)
                    setFakeAmount(value)
                }
            }
        }

    }

    return showModal.stake ? (
        <div id="will_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <Title className="will">
                        <strong>Stake</strong>
                    </Title>
                    <DescriptionWrap>
                        <p>{`Available : ${convertDecimal(stakeData.lpTokenBalance, stakeData.lpTokenDecimals)}`}</p>
                        <p>{`${splitPoolNameObj.lpTokenSymbol} tomswap LP`}</p>
                        <InputBox>
                            <input type="text" placeholder="Input amount" value={fakeAmount} onChange={e => onChange(e, 'stake')} />
                            <button onClick={() => {
                                setAmount(stakeData.lpTokenBalance)
                                setFakeAmount(convertDecimal(stakeData.lpTokenBalance, stakeData.lpTokenDecimals))
                            }}>Max</button>
                        </InputBox>
                    </DescriptionWrap>
                </div>
                <ButtonWrap>
                    <button className="pop_call pop_close" onClick={() => setShowModal({ ...showModal, stake: false })}>Cancel</button>
                    <button className={`pop_call pop_close ${Number(amount) > 0 && fakeAmount <= convertDecimal(stakeData.lpTokenBalance, stakeData.lpTokenDecimals) ? '' : 'disabled'}`} onClick={() => {
                        handleLpTokenRequestTx(() => lpTokenRequestTx(splitPoolNameObj.lpTokenSymbol, 'stake', amount, stakeData.lpTokenDecimals, stakeData))
                    }}>Confirm</button>
                </ButtonWrap>
            </div>
        </div>
    ) : showModal.unStake ? (
        <div id="will_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <Title className="will">
                        <strong>Unstake</strong>
                    </Title>
                    <DescriptionWrap>
                        <p>{`Available : ${convertDecimal(stakeData.stakedToken, stakeData.lpTokenDecimals)}`}</p>
                        <p>{`${splitPoolNameObj.lpTokenSymbol} tomswap LP`}</p>
                        <InputBox>
                            <input type="number" placeholder="Input amount" value={fakeAmount} onChange={e => onChange(e, 'unStake')} />
                            <button onClick={() => {
                                setAmount(stakeData.stakedToken)
                                setFakeAmount(convertDecimal(stakeData.stakedToken, stakeData.lpTokenDecimals))
                            }}>Max</button>
                        </InputBox>
                    </DescriptionWrap>
                </div>
                <ButtonWrap>
                    <button className="pop_call pop_close" onClick={() => setShowModal({ ...showModal, unStake: false })}>Cancel</button>
                    <button className={`pop_call pop_close ${Number(amount) > 0 && fakeAmount <= convertDecimal(stakeData.stakedToken, stakeData.lpTokenDecimals) ? '' : 'disabled'}`} onClick={() => {
                        handleLpTokenRequestTx(() => lpTokenRequestTx(splitPoolNameObj.lpTokenSymbol, 'unStake', amount, stakeData.lpTokenDecimals, stakeData))
                    }}>Confirm</button>
                </ButtonWrap>
            </div>
        </div>
    ) : null
}

export default StakeModal