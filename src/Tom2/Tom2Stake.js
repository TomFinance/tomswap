import React, { useEffect } from 'react'

const Tom2Stake = ({ match: { params: { route } }, history }) => {

    useEffect(() => {
        if (!['tmtg-lbxc'].includes(route)) {
            history.replace('/')
        }
    }, [history, route])

    return (
        <div id="container" className="stack">
            <div className="main_top">
                <div className="wrapper">
                    <div className="tit">
                        <p className="img"><img src="/images/ico/ico_main.png" alt="" /></p>
                        <p className="txt txt03"><img src="/images/ico/ico_tit03.png" alt="" /></p>
                        <h3>Deposit TMTG-LBXC UNI-V2 LP Earn TOM</h3>
                    </div>
                </div>
            </div>
            <div className="main_btm">
                <div className="figure">
                    <div className="tmtg">
                        <p>0.00000000</p>
                        <span>xSUSHI (SushiBar) Available</span>
                        <a href="#unstake_pop" className="main_btn pop_call">Convert to SUSHI</a>
                    </div>
                    <div className="lbxc">
                        <p>0.00000000</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <a href="#unstake_pop" className="main_btn pop_call">SUSHI Tokens Available</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tom2Stake