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
                        <dd className="ico ico02">{Number(aToken.amount).toPrecision(12)}</dd>
                        <dd className="ico ico01">{Number(bToken.amount).toPrecision(12)}</dd>
                        <dt>{`${UpperTokenSymbolA} per ${UpperTokenSymbolB} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolB} = ${Number(calcData.left).toPrecision(12)} ${UpperTokenSymbolA}`}</dd>
                        <dt></dt>
                        <dt>{`${UpperTokenSymbolB} per ${UpperTokenSymbolA} `}</dt>
                        <dd>{`1 ${UpperTokenSymbolA} = ${Number(calcData.center).toPrecision(12)} ${UpperTokenSymbolB}`}</dd>
                        <dt>Share of Pool</dt>
                        <dd>{Number(calcData.right).toPrecision()}%</dd>
                    </dl>
                </div>
                <button className="pop_call pop_close" onClick={confirmFunc}>Confirm Supply</button>
            </div>
        </div>
    )
}

export default ConfirmModal