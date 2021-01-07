import React from 'react'
import styled from '@emotion/styled'
import { convertDecimal } from 'utils/utils'

const CloseBtn = styled.button`
    position:absolute;
    top:18px;
    right:18px;
    width:18px;
    height:18px;
    text-indent:-9999px;
    border-radius:0;
    background: url('/images/ico/ico_pop_close.png') no-repeat center;
    background-size:100%;
`

const ConfirmModal = ({ aToken, bToken, calcData, closeFunc, confirmFunc }) => {
    const UpperTokenSymbolA = aToken.symbol.toUpperCase()
    const UpperTokenSymbolB = bToken.symbol.toUpperCase()

    return (
        <div id="will_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <h3>You will receive</h3>
                    <div className="will">
                        <strong>{convertDecimal(Number(calcData.receiveToken))}</strong>
                        <p>{`${UpperTokenSymbolA}/${UpperTokenSymbolB} Pool Token`}</p>
                        {/* <span>Output is…</span> */}
                    </div>
                    <dl className="output">
                        <dt>Prices and pool share</dt>
                        <dd className={`ico ${aToken.symbol.toLowerCase()}`}>{convertDecimal(Number(aToken.amount))}</dd>
                        <dd className={`ico ${bToken.symbol.toLowerCase()}`}>{convertDecimal(Number(bToken.amount))}</dd>
                        <dt>{`${UpperTokenSymbolA} per ${UpperTokenSymbolB} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolA} = ${convertDecimal(Number(calcData.center))} ${UpperTokenSymbolB}`}</dd>
                        <dt></dt>
                        <dt>{`${UpperTokenSymbolB} per ${UpperTokenSymbolA} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolB} = ${convertDecimal(Number(calcData.left))} ${UpperTokenSymbolA}`}</dd>
                        <dt>Share of Pool</dt>
                        <dd>{convertDecimal(Number(calcData.right))}%</dd>
                    </dl>
                </div>
                <button className="pop_call pop_close" onClick={confirmFunc}>Confirm Supply</button>
                <CloseBtn onClick={closeFunc} />
            </div>
        </div>
    )
}

export default ConfirmModal