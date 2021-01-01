import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateAPY } from 'utils/web3Utils'

const Tom2 = () => {
    useEffect(() => {
        calculateAPY()
            .then(res => {
                console.log(res)
            })
    }, [])

    return (
        <div>
            <div className="main_top">
                <div className="wrapper">
                    <div className="tit">
                        <p className="img"><img src="/images/ico/ico_main.png" alt="" /></p>
                        <p className="txt txt02"><img src="/images/ico/ico_tit02.png" alt="" /></p>
                        <h3>Get TOM2 by staking TOM LP tokens.</h3>
                    </div>
                </div>
            </div>
            <div id="jsTom2GridLayout" className="main_btm">
                <div className="figure">
                    <div className="tmtg">
                        <p>TMTG/LBXC Pool</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <Link className={'main_btn'} to={'/tom2/detail/tmtg-lbxc'}>Select</Link>
                        <div className="pend">
                            <p>APY</p>
                            <span>0%</span>
                        </div>
                    </div>
                    <div className="lbxc coming red_mark">
                        <p>TOM/TMTG Pool</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <a href="#;" className="main_btn">COMING SOON</a>
                        <div className="pend">
                            <p>APY</p>
                            <span>0%</span>
                        </div>
                    </div>
                    <div className="tom_lb coming red_mark red_mark02">
                        <p>TOM/LBXC Pool</p>
                        <span>Desposit TMTG-LBXC UNI-V2 LP Earn TOM2</span>
                        <a href="#;" className="main_btn">COMING SOON</a>
                        <div className="pend">
                            <p>APY</p>
                            <span>0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tom2