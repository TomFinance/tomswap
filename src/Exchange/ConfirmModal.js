import React from 'react'

const ConfirmModal = ({ aToken, bToken, calcData, confirmFunc }) => {
    const UpperTokenSymbolA = aToken.symbol.toUpperCase()
    const UpperTokenSymbolB = bToken.symbol.toUpperCase()

    return (
        <div id="will_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <h3>You will receive</h3>
                    <div className="will">
                        <strong>0.00000123456</strong>
                        <p>{`${UpperTokenSymbolA}/${UpperTokenSymbolB} Pool Token`}</p>
                        <span>Output is…</span>
                    </div>
                    <dl className="output">
                        <dt>Prices and pool share</dt>
                        <dd className="ico ico01">{aToken.amount}</dd>
                        <dd className="ico ico02">{bToken.amount}</dd>
                        <dt>{`${UpperTokenSymbolA} per ${UpperTokenSymbolB} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolB} = ${calcData.left} ${UpperTokenSymbolA}`}</dd>
                        <dt></dt>
                        <dt>{`${UpperTokenSymbolB} per ${UpperTokenSymbolA} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolA} = ${calcData.center} ${UpperTokenSymbolB}`}</dd>
                        <dt>Share of Pool</dt>
                        <dd>{calcData.right}</dd>
                    </dl>
                </div>
                <button className="pop_call pop_close" onClick={confirmFunc}>Confirm Supply</button>
            </div>
        </div>
    )
}

export default ConfirmModal