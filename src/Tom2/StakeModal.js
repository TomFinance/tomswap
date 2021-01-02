import React, { useState } from 'react'
import styled from '@emotion/styled'
import { convertDecimal } from 'utils/utils'
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
    const [amount, setAmount] = useState(0)

    const onChange = e => {
        const { taget: { value } } = e

        setAmount(value)
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
                        <p>{`${splitPoolNameObj.lpTokenSymbol} UNI-V2 LP`}</p>
                        <InputBox>
                            <input type="text" value={amount} onChange={onChange} />
                            <button onClick={() => setAmount(stakeData.lpTokenBalance * Math.pow(0.1, stakeData.lpTokenDecimals))}>Max</button>
                        </InputBox>
                    </DescriptionWrap>
                </div>
                <ButtonWrap>
                    <button className="pop_call pop_close" onClick={() => setShowModal({ ...showModal, stake: false })}>Cancel</button>
                    <button className="pop_call pop_close" onClick={() => {
                        handleLpTokenRequestTx(() => lpTokenRequestTx(splitPoolNameObj.lpTokenSymbol, 'stake', amount, stakeData.lpTokenDecimals))
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
                        <p>{`Available : ${convertDecimal(stakeData.lpTokenBalance, stakeData.lpTokenDecimals)}`}</p>
                        <p>{`${splitPoolNameObj.lpTokenSymbol} UNI-V2 LP`}</p>
                    </DescriptionWrap>
                </div>
                <ButtonWrap>
                    <button className="pop_call pop_close" onClick={() => setShowModal({ ...showModal, unStake: false })}>Cancel</button>
                    <button className="pop_call pop_close" onClick={() => {
                        handleLpTokenRequestTx(() => lpTokenRequestTx(splitPoolNameObj.lpTokenSymbol, 'unStake'))
                    }}>Confirm</button>
                </ButtonWrap>
            </div>
        </div>
    ) : null
}

export default StakeModal