import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import useInput from 'utils/hook/useInput'
import { PRESET_TOKEN } from 'config'
import { convertDecimal } from 'utils/utils'
import { getTokenBalance } from 'utils/web3Utils'
import { getMetaMaskMyAccount } from 'utils/metaMask'
import HelpBox from 'Global/HelpBox'

const TokenItem = styled.article`
    cursor: pointer;
`

const TokenListModal = ({ addLiquidityInput, setAddLiquidityInput }) => {
    const [tokenList, setTokenList] = useState([])
    const [tempTokenList, setTempTokenList] = useState(null)
    const searchTokenInput = useInput('')

    const getInitTokenList = useCallback(
        async () => {
            setTokenList(
                await Promise.all(Object.keys(PRESET_TOKEN)
                    .map(async key => {
                        return getTokenBalance(PRESET_TOKEN[key], await getMetaMaskMyAccount())
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
                const tokenInfo = await getTokenBalance(tokenAddress, await getMetaMaskMyAccount())
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
            amount: '',
            show: false
        })
    }

    return (
        <div id="token_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <h3 style={{ display: 'flex', alignItems: 'center' }}>
                        Select a token
                        <HelpBox id={11} helpText={'Find a token by searching for its name or symbol or by pasting its address below.'} />
                    </h3>
                    <input type="text" placeholder="Paste Address" value={searchTokenInput.value} onChange={searchTokenInputOnchange} />
                    <div className="token_name">
                        <p>Token Name</p>
                        <dl>
                            <div className="default_list">
                                {tempTokenList === null ? (
                                    <>
                                        {tokenList.map((token, idx) => {
                                            return (
                                                <TokenItem key={idx} onClick={() => onClickToken(token)}>
                                                    <dt className={`${token.symbol.toLowerCase()}`}>{token.symbol}</dt>
                                                    {token.balance ? (
                                                        <dd className="stv_value">{convertDecimal(token.balance, token.decimals)}</dd>
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
                                                const tempTokenSymbol = tempToken.symbol.toLowerCase()

                                                return (
                                                    <TokenItem key={idx} onClick={() => onClickToken(tempToken)}>
                                                        <dt className={`${tempTokenSymbol === 'weth' ? 'eth' : tempTokenSymbol}`}>{tempTokenSymbol === 'weth' ? 'ETH' : tempToken.symbol}</dt>
                                                        {tempToken.balance ? (
                                                            <dd className="stv_value">{convertDecimal(tempToken.balance, tempToken.decimals)}</dd>
                                                        ) : (
                                                                <dd className="stv_value">{0}</dd>
                                                            )}
                                                    </TokenItem>
                                                )
                                            })}
                                        </>
                                    )
                                }
                            </div>
                        </dl>
                    </div>
                </div>
                <a href="#;" className="pop_close" onClick={() => setAddLiquidityInput({ ...addLiquidityInput, show: false })}>닫기</a>
            </div>
        </div>
    )
}

export default TokenListModal