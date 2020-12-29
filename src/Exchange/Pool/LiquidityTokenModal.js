import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import useInput from 'utils/hook/useInput'
import { PRESET_TOKEN } from 'config'
import { accountLocalStorage, conventDecimal } from 'utils/utils'
import { getTokenBalance } from 'utils/web3Utils'

const TokenItem = styled.article`
    cursor: pointer;
`

const LiquidityTokenModal = ({ addLiquidityInput, setAddLiquidityInput }) => {
    // const [tokenList, setTokenList] = useState([{ symbol: 'STV', tokenAddress: '0xA3686f63b2E16aD3948f9a1DA329de1Ae161D865' }, { symbol: 'DAV', tokenAddress: '0xF0cA52FeFCce1153A033d13E5387CD5b98E900C1' }, { symbol: 'NOAH', tokenAddress: '0x153D8c4c4105d120B35085e24068888116bC2732' }, { symbol: 'HUNT', tokenAddress: '0xFE54F701299c06131B287Fa44770634A692d0CEd' }, { symbol: 'HANK', tokenAddress: '0xD3683bDbFD2C1e81d53c899A2dC47D2c788c7B2d' }, { symbol: 'TOM2', tokenAddress: '0xbf7920D000A06C06c3b63902f0BbA33126C2e844' }])
    const [tokenList, setTokenList] = useState([])
    const [tempTokenList, setTempTokenList] = useState(null)
    const searchTokenInput = useInput('')

    const getInitTokenList = useCallback(
        async () => {
            setTokenList(
                await Promise.all(Object.keys(PRESET_TOKEN)
                    .map(key => {
                        return getTokenBalance(PRESET_TOKEN[key], accountLocalStorage.getMyAccountAddress())
                    })
                )
            )
        }, [])

    useEffect(() => {
        getInitTokenList()
    }, [getInitTokenList])

    const searchTokenInputOnchange = async e => {
        const { target: { value: tokenAddress } } = e
        searchTokenInput.setValue(tokenAddress)

        if (tokenAddress) {
            try {
                const tokenInfo = await getTokenBalance(tokenAddress, accountLocalStorage.getMyAccountAddress())
                setTempTokenList([tokenInfo])
            } catch (err) {
                setTempTokenList([])
            }
        } else {
            setTempTokenList(null)
        }
    }

    const onClickToken = tokenInfo => {
        setAddLiquidityInput({
            ...addLiquidityInput,
            ...tokenInfo,
            show: false
        })
    }

    return (
        <div id="token_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <h3>Select a token
					<a href="#;" className="q_ico">
                            <div className="help_box">
                                Find a token…
						</div>
                        </a>
                    </h3>
                    <input type="text" placeholder="Text" value={searchTokenInput.value} onChange={searchTokenInputOnchange} />
                    <div className="token_name">
                        <p>Token Name</p>
                        <dl>
                            <div className="default_list">
                                {tempTokenList === null ? (
                                    <>
                                        {tokenList.map((token, idx) => {
                                            return (
                                                <TokenItem key={idx} onClick={() => onClickToken(token)}>
                                                    <dt className="not-found">{token.symbol}</dt>
                                                    {token.balance ? (
                                                        <dd className="stv_value">{conventDecimal(token.balance, token.decimals)}</dd>
                                                    ) : (
                                                            <dd className="stv_value">{0}</dd>
                                                        )}
                                                </TokenItem>
                                            )
                                        })}
                                    </>
                                ) : (
                                        <>
                                            {tempTokenList.map((tempToken, idx) => {
                                                return (
                                                    <TokenItem key={idx} onClick={() => onClickToken(tempToken)}>
                                                        <dt className="not-found">{tempToken.symbol}</dt>
                                                        <dd className="stv_value">{conventDecimal(tempToken.balance, tempToken.decimals)}</dd>
                                                    </TokenItem>
                                                )
                                            })}
                                        </>
                                    )}
                            </div>
                        </dl>
                    </div>
                </div>
                <a href="#;" className="pop_close" onClick={() => setAddLiquidityInput({ ...addLiquidityInput, show: false })}>닫기</a>
            </div>
        </div>
    )
}

export default LiquidityTokenModal