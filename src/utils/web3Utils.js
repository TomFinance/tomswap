import Web3 from "web3"
import { checkETH, convertDecimal, filterdETH, positionLocalStorage } from "./utils"
import { getMetaMaskMyAccount, metaMaskSendTx } from "./metaMask"
import { MINING_POOLS, LP_TOKEN_PAIRS, PAIR_POOL_ADDRESS_FOR_APY, ETH_ADDRESS, CONTRACT_ADDRESS, CONTRACT_ABI } from "config"
import bigInt from "big-integer"
import { WETH_ADDRESS } from "config"
import { PRESET_TOKEN } from "config"

const INFINITY = '115792089237316195423570985008687907853269984665640564039457584007913129639935' //(2n ** 256n - 1n).toString()
const etherWeb3 = new Web3(window.ethereum)

// #region - ETH
export const getBalance = async account => {
    return window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
}
// #endregion

// #region - Home
export const getTotalSupply = async () => {
    const res = await etherWeb3.eth.getBlockNumber()

    return res ? Number((res - 11652418) * 0.0182) : 0
}
// #endregion

// #region - Account
export const getTokenBalance = async (tokenAddress, account) => {
    if (tokenAddress === ETH_ADDRESS) {
        return {
            name: 'ETH',
            symbol: 'ETH',
            totalSupply: '',
            decimals: 18,
            balance: await getBalance(account),
            tokenAddress: 'ETHER'
        }
    }

    const contractObject = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    return {
        name: await contractObject.methods.name().call(),
        symbol: await contractObject.methods.symbol().call(),
        totalSupply: await contractObject.methods.totalSupply().call(),
        decimals: await contractObject.methods.decimals().call(),
        balance: await contractObject.methods.balanceOf(account).call(),
        tokenAddress,
    }
}
// #endregion

// #region - Tom2
export async function calculateAPY(lpTokenSymbol) {
    const ethTomPairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, PAIR_POOL_ADDRESS_FOR_APY['ETH-TOM2'])
    const ethTomReserves = await ethTomPairContract.methods.getReserves().call()

    const tom_price = (ethTomReserves._reserve0 / ethTomReserves._reserve1)

    const lpTokenPoolContract = new etherWeb3.eth.Contract(CONTRACT_ABI.POOL, MINING_POOLS[lpTokenSymbol])

    const rewardPerBlock = await lpTokenPoolContract.methods.rewardPerBlock().call()
    const totalStaked = await lpTokenPoolContract.methods.TOTAL_STAKED().call()

    // console.log(`번 돈: ${tom_price * Number(rewardPerBlock) / Number(totalStaked)}`)

    if (totalStaked > 0) {
        const targetSymbol = lpTokenSymbol.split('-')[0]
        const lPTokenEthSymbol = `ETH-${targetSymbol}`

        const ethLpTokenContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, PAIR_POOL_ADDRESS_FOR_APY[lPTokenEthSymbol])
        const ethLpTokenReserves = await ethLpTokenContract.methods.getReserves().call()

        const ethLpTokenToken0 = await ethLpTokenContract.methods.token0().call()
        const ethLpTokenToken1 = await ethLpTokenContract.methods.token1().call()

        const ethReserve = ethLpTokenToken0.toLowerCase() === WETH_ADDRESS.toLowerCase() ? ethLpTokenReserves._reserve0 : ethLpTokenReserves._reserve1
        const lpTokenReserve = ethLpTokenToken1.toLowerCase() === WETH_ADDRESS.toLowerCase() ? ethLpTokenReserves._reserve0 : ethLpTokenReserves._reserve1

        const lpTokenPrice = (ethReserve / lpTokenReserve)

        const lpTokenPairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, LP_TOKEN_PAIRS[lpTokenSymbol])
        const notEthlpTokenReserve = await lpTokenPairContract.methods.getReserves().call()

        const lpTokenToken0 = await ethLpTokenContract.methods.token0().call()

        const exacTokenReserve = lpTokenToken0.toLowerCase() === PRESET_TOKEN[targetSymbol].toLowerCase() ? notEthlpTokenReserve._reserve0 : notEthlpTokenReserve._reserve1
        const lpTokenTotalSuply = await lpTokenPairContract.methods.totalSupply().call()

        // console.log(`넣은 돈: ${lpTokenPrice * (exacTokenReserve * 2) / lpTokenTotalSuply}`)

        const PPB = (tom_price * Number(rewardPerBlock) / Number(totalStaked)) / (lpTokenPrice * (exacTokenReserve * 2) / lpTokenTotalSuply)

        // console.log(`블럭당 수익률: ${PPB}`)
        // console.log(`연간 수익률: ${(((PPB * 86400 * 365) / 13) * 100)}`)

        return ((PPB * 86400 * 365) / 13) * 100
    }

    return 'Infinity'
}

export const getMyLpTokenBalance = async lpTokenSymbol => {
    const poolContract = new etherWeb3.eth.Contract(CONTRACT_ABI.POOL, MINING_POOLS[lpTokenSymbol])

    return {
        stakedToken: await poolContract.methods.inquiryDeposit(await getMetaMaskMyAccount()).call(),
        tom2Amount: await poolContract.methods.inquiryExpectedReward(await getMetaMaskMyAccount()).call(),
    }
}

export const checkTom2PoolApprove = async lpTokenSymbol => {
    const lpTokenContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, LP_TOKEN_PAIRS[lpTokenSymbol])

    const lpTokenBalance = await lpTokenContract.methods.balanceOf(await getMetaMaskMyAccount()).call()
    const lpTokenDecimals = await lpTokenContract.methods.decimals().call()
    const lpTokenAllowance = await lpTokenContract.methods.allowance(await getMetaMaskMyAccount(), MINING_POOLS[lpTokenSymbol]).call()

    return {
        lpTokenBalance,
        lpTokenDecimals,
        lpTokenAllowance: Number(lpTokenBalance) < Number(lpTokenAllowance)
    }
}

export const confirmLpTokenApprove = async lpTokenSymbol => {
    const poolContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, LP_TOKEN_PAIRS[lpTokenSymbol])

    await metaMaskSendTx({
        from: await getMetaMaskMyAccount(),
        to: LP_TOKEN_PAIRS[lpTokenSymbol],
        data: poolContract.methods.approve(
            MINING_POOLS[lpTokenSymbol],
            INFINITY
        ).encodeABI()
    })
}

export const lpTokenRequestTx = async (lpTokenSymbol, action, amount, lpTokenDecimals, stakeData) => {
    const poolContract = new etherWeb3.eth.Contract(CONTRACT_ABI.POOL, LP_TOKEN_PAIRS[lpTokenSymbol])

    const txObject = {
        from: await getMetaMaskMyAccount(),
        to: MINING_POOLS[lpTokenSymbol],
        value: 0x0
    }

    switch (action) {
        case 'stake':
            txObject.data = poolContract.methods.stake(
                stakeData.lpTokenBalance === amount
                    ? bigInt(stakeData.lpTokenBalance).value
                    : bigInt(Math.floor(amount * Math.pow(10, lpTokenDecimals))).value
            ).encodeABI()
            break
        case 'unStake':
            txObject.data = poolContract.methods.claimAndUnstake(
                stakeData.stakedToken === amount
                    ? bigInt(stakeData.stakedToken).value
                    : bigInt(Math.floor(amount * Math.pow(10, lpTokenDecimals))).value
            ).encodeABI()
            break
        case 'emergencyExit':
            txObject.data = poolContract.methods.emergencyExit().encodeABI()
            break
        case 'claim':
            txObject.data = poolContract.methods.claimAllReward(
            ).encodeABI()
            break
        default:
            return false
    }

    await metaMaskSendTx(txObject)
}
// #endregion

// #region - Pool
export const createCalculatePrice = (addLiquidityInputA, addLiquidityInputB) => {
    if (!addLiquidityInputA.amount || !addLiquidityInputB.amount) { return false }
    if (!addLiquidityInputA.tokenAddress
        || !addLiquidityInputB.tokenAddress
        || addLiquidityInputA.tokenAddress === addLiquidityInputB.tokenAddress) {
        return false
    }

    return {
        token0Price: addLiquidityInputB.amount / addLiquidityInputA.amount,
        token1Price: addLiquidityInputA.amount / addLiquidityInputB.amount
    }
}

export const createPreviewPrice = async (addLiquidityInputA, addLiquidityInputB) => {
    const prices = createCalculatePrice(addLiquidityInputA, addLiquidityInputB)

    if (!prices) { return false }

    const totalShare = Math.sqrt(((Number(addLiquidityInputA.amount) * Math.pow(10, addLiquidityInputA.decimals)) * (Number(addLiquidityInputB.amount) * Math.pow(10, addLiquidityInputB.decimals))) / 1e36)

    return ({
        '0': prices.token1Price,
        '1': prices.token0Price,
        '4': totalShare
    })
}

export const getCheckPairContract = async (tokenAddressA, tokenAddressB) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(checkETH(tokenAddressA), checkETH(tokenAddressB)).call()

    return Number(pairAddress) !== 0
}

export const createCheckApprove = async (tokenAddress, amount, decimals) => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, checkETH(tokenAddress))

    const tokenAllowance = await token0Contract.methods.allowance(await getMetaMaskMyAccount(), CONTRACT_ADDRESS.ROUTER).call()

    return tokenAddress === ETH_ADDRESS ? true : tokenAllowance > Number(amount) * Math.pow(10, decimals)
}

export const createConfirmApprove = async tokenAddress => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    await metaMaskSendTx({
        from: await getMetaMaskMyAccount(),
        to: tokenAddress,
        data: token0Contract.methods.approve(
            CONTRACT_ADDRESS.ROUTER,
            INFINITY
        ).encodeABI()
    })
}

export const createImportCreate = async (aToken, bToken) => {
    const routerContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ROUTER, CONTRACT_ADDRESS.ROUTER)

    etherWeb3.utils.toChecksumAddress(await getMetaMaskMyAccount())
    etherWeb3.utils.toChecksumAddress(CONTRACT_ADDRESS.ROUTER)
    etherWeb3.utils.toChecksumAddress(checkETH(aToken.tokenAddress))
    etherWeb3.utils.toChecksumAddress(checkETH(bToken.tokenAddress))

    const ethIdx = filterdETH(aToken.tokenAddress, bToken.tokenAddress)

    if (ethIdx >= 0) {
        const token = [aToken, bToken][1 - ethIdx]
        const ethToken = [aToken, bToken][ethIdx]

        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: CONTRACT_ADDRESS.ROUTER,
            data: routerContract.methods.addLiquidityETH(
                token.tokenAddress,
                token.amount === convertDecimal(token.balance, token.decimals)
                    ? bigInt(token.balance).value
                    : bigInt(Math.floor(Number(token.amount) * Math.pow(10, token.decimals))).value,
                bigInt(Math.floor(Number(token.amount) * 0.995 * Math.pow(10, aToken.decimals))).value,
                bigInt(Math.floor(Number(ethToken.amount) * 0.995 * Math.pow(10, bToken.decimals))).value,
                await getMetaMaskMyAccount(),
                Math.floor((+new Date()) / 1000) + 3600
            ).encodeABI(),
            value: Math.floor(Number(ethToken.amount) * Math.pow(10, ethToken.decimals))
        })
    } else {
        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: CONTRACT_ADDRESS.ROUTER,
            data: routerContract.methods.addLiquidity(
                aToken.tokenAddress,
                bToken.tokenAddress,
                aToken.amount === convertDecimal(aToken.balance, aToken.decimals)
                    ? bigInt(aToken.balance).value
                    : bigInt(Math.floor(Number(aToken.amount) * Math.pow(10, aToken.decimals))).value,
                bToken.amount === convertDecimal(bToken.balance, bToken.decimals)
                    ? bigInt(bToken.balance).value
                    : bigInt(Math.floor(Number(bToken.amount) * Math.pow(10, bToken.decimals))).value,
                bigInt(Math.floor(Number(aToken.amount) * 0.995 * Math.pow(10, aToken.decimals))).value,
                bigInt(Math.floor(Number(bToken.amount) * 0.995 * Math.pow(10, bToken.decimals))).value,
                await getMetaMaskMyAccount(),
                Math.floor((+new Date()) / 1000) + 3600
            ).encodeABI(),
            value: 0x0
        })
    }
}

export const addLiquidityGatherPairData = async (tokenAddressA, tokenAddressB) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(tokenAddressA, tokenAddressB).call()

    if (Number(pairAddress) === 0) {
        return false
    }

    const pairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, pairAddress)
    const pairToken0 = await pairContract.methods.token0().call()
    const pairToken1 = await pairContract.methods.token1().call()

    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddressA)
    const token1Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddressB)

    const token0Symbol = await token0Contract.methods.symbol().call()
    const token1Symbol = await token1Contract.methods.symbol().call()

    const token0Decimals = await token0Contract.methods.decimals().call()
    const token1Decimals = await token1Contract.methods.decimals().call()

    const tokenReserves = await pairContract.methods.getReserves().call()
    const token0Reserve = pairToken0.toLowerCase() === tokenAddressA.toLowerCase() ? tokenReserves._reserve0 : tokenReserves._reserve1
    const token1Reserve = pairToken1.toLowerCase() === tokenAddressB.toLowerCase() ? tokenReserves._reserve1 : tokenReserves._reserve0

    const pairSupply = await pairContract.methods.totalSupply().call()
    const pairDecimals = await pairContract.methods.decimals().call()

    const pairContractBalance = await pairContract.methods.balanceOf(await getMetaMaskMyAccount()).call()

    return {
        token0Symbol,
        token0Reserve,
        token1Reserve,
        token1Symbol,
        token0Decimals,
        token1Decimals,
        pairSupply,
        pairDecimals,
        pairContractBalance
    }
}

export const addLiquidityPreview = async (aToken, bToken) => {
    const pairData = await addLiquidityGatherPairData(checkETH(aToken.tokenAddress), checkETH(bToken.tokenAddress))

    if (!pairData) {
        return false
    }

    const token0Reserve = (pairData.token0Reserve / Math.pow(10, pairData.token0Decimals))
    const token1Reserve = (pairData.token1Reserve / Math.pow(10, pairData.token1Decimals))

    const token0Price = token1Reserve / token0Reserve

    const pairSupply = Math.sqrt(token0Reserve * token1Reserve)
    // const pairSupply = pairData.pairSupply / Math.pow(10, pairData.pairDecimals)

    const calcTokenAmountB = aToken.amount * token0Price

    const token0Expect = token0Reserve + Number(aToken.amount)
    const token1Expect = token1Reserve + Number(calcTokenAmountB)
    const totalShare = Math.sqrt(token0Expect * Math.pow(10, pairData.token0Decimals) * token1Expect * Math.pow(10, pairData.token1Decimals) / 1e36)

    const calcText = await createPreviewPrice(aToken, { ...bToken, amount: calcTokenAmountB })

    return {
        '0': calcText['0'],
        '1': calcText['1'],
        '2': `${((totalShare - pairSupply) / totalShare * 100)}`,
        '3': calcTokenAmountB,
        '4': totalShare - pairSupply
    }
}
// #endregion

// #region - Remove Liquidity
export const myPositionCheck = async (tokenAddressA, tokenAddressB) => {
    const pairData = await addLiquidityGatherPairData(checkETH(tokenAddressA), checkETH(tokenAddressB))

    if (!pairData) {
        return false
    }
    const lpToken = pairData.pairContractBalance
    const lpTokenView = pairData.pairContractBalance / Math.pow(10, pairData.pairDecimals)
    const persent = pairData.pairContractBalance / pairData.pairSupply
    const token0Value = pairData.token0Reserve * persent
    const token1Value = pairData.token1Reserve * persent
    const token0ViewValue = pairData.token0Reserve / Math.pow(10, pairData.token0Decimals) * persent
    const token1ViewValue = pairData.token1Reserve / Math.pow(10, pairData.token1Decimals) * persent

    return {
        lpToken,
        lpTokenView,
        persent,
        pairDecimals: pairData.pairDecimals,
        token0Symbol: pairData.token0Symbol,
        token0Value,
        token0ViewValue,
        token1Symbol: tokenAddressB === ETH_ADDRESS ? 'ETH' : pairData.token1Symbol,
        token1Value,
        token1ViewValue,
    }
}

export const checkRemoveLiquidityApprove = async (tokenAddressA, tokenAddressB, myLpToken) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(checkETH(tokenAddressA), checkETH(tokenAddressB)).call()
    const pairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, pairAddress)

    const pairTokenAllowance = await pairContract.methods.allowance(await getMetaMaskMyAccount(), CONTRACT_ADDRESS.ROUTER).call()

    return pairTokenAllowance > myLpToken
}

export const requestRemoveLiquidityApprove = async (tokenAddressA, tokenAddressB, myLpToken) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(checkETH(tokenAddressA), checkETH(tokenAddressB)).call()
    const pairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, pairAddress)

    const pairTokenAllowance = await pairContract.methods.allowance(await getMetaMaskMyAccount(), CONTRACT_ADDRESS.ROUTER).call()

    if (pairTokenAllowance <= myLpToken) {
        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: pairAddress,
            data: pairContract.methods.approve(
                CONTRACT_ADDRESS.ROUTER,
                INFINITY
            ).encodeABI()
        })
    }
}

export const requestRemoveLiquidity = async (myPosition, removePersent) => {
    const routerContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ROUTER, CONTRACT_ADDRESS.ROUTER)

    if (myPosition.tokenAddressA === ETH_ADDRESS || myPosition.tokenAddressB === ETH_ADDRESS) {
        const token = myPosition.tokenAddressA === ETH_ADDRESS ? 'B' : 'A'
        const tokenNumber = myPosition.tokenAddressA === ETH_ADDRESS ? '1' : '0'
        const ethTokenNumber = myPosition.tokenAddressA === ETH_ADDRESS ? '0' : '1'

        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: CONTRACT_ADDRESS.ROUTER,
            data: routerContract.methods.removeLiquidityETH(
                myPosition[`tokenAddress${token}`],
                bigInt(myPosition.lpToken).value * bigInt(removePersent).value / 100n,
                bigInt(Math.floor(Number(myPosition[`token${tokenNumber}Value`]) * Number(removePersent) / 100 * 0.995)).value,
                bigInt(Math.floor(Number(myPosition[`token${ethTokenNumber}Value`]) * Number(removePersent) / 100 * 0.995)).value,
                await getMetaMaskMyAccount(),
                Math.floor((+new Date()) / 1000) + 3600
            ).encodeABI(),
            value: 0x0
        })
    } else {
        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: CONTRACT_ADDRESS.ROUTER,
            data: routerContract.methods.removeLiquidity(
                myPosition.tokenAddressA,
                myPosition.tokenAddressB,
                bigInt(myPosition.lpToken).value * bigInt(removePersent).value / 100n,
                bigInt(Math.floor(Number(myPosition.token0Value) * Number(removePersent) / 100 * 0.995)).value,
                bigInt(Math.floor(Number(myPosition.token1Value) * Number(removePersent) / 100 * 0.995)).value,
                await getMetaMaskMyAccount(),
                Math.floor((+new Date()) / 1000) + 3600
            ).encodeABI(),
            value: 0x0
        })
    }

    if (removePersent === 1) {
        positionLocalStorage.removeMyPositionList(myPosition.tokenAddressA, myPosition.tokenAddressB)
    }
}
// #endregion

// #region - Swap
export const swapCheckPair = async (tokenAddressA, tokenAddressB) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(tokenAddressA, tokenAddressB).call()

    if (pairAddress) {
        return false
    }
}

export const swapGatherPairData = async (tokenAddressA, tokenAddressB) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(tokenAddressA, tokenAddressB).call()

    if (Number(pairAddress) === 0) {
        return false
    }

    const pairContract = new etherWeb3.eth.Contract(CONTRACT_ABI.PAIR, pairAddress)
    const pairToken0 = await pairContract.methods.token0().call()
    const pairToken1 = await pairContract.methods.token1().call()

    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddressA)
    const token1Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddressB)
    const token0Decimals = await token0Contract.methods.decimals().call()
    const token1Decimals = await token1Contract.methods.decimals().call()

    const tokenReserves = await pairContract.methods.getReserves().call()
    const token0Reserve = pairToken0.toLowerCase() === tokenAddressA.toLowerCase() ? tokenReserves._reserve0 : tokenReserves._reserve1
    const token1Reserve = pairToken1.toLowerCase() === tokenAddressB.toLowerCase() ? tokenReserves._reserve1 : tokenReserves._reserve0

    const pairSupply = await pairContract.methods.totalSupply().call()
    const pairDecimals = await pairContract.methods.decimals().call()

    return {
        token0Reserve,
        token0Decimals,
        token1Reserve,
        token1Decimals,
        pairSupply,
        pairDecimals
    }
}

export const swapQuotePrice = async (tokenA, tokenB) => {
    const pairData = await swapGatherPairData(checkETH(tokenA.tokenAddress), checkETH(tokenB.tokenAddress))

    if (!pairData) {
        return false
    }

    const token0Reserve = (pairData.token0Reserve / Math.pow(10, pairData.token0Decimals))
    const token1Reserve = (pairData.token1Reserve / Math.pow(10, pairData.token1Decimals))

    const token0Input = Number(tokenA.amount)
    const token0Expect = token0Reserve + token0Input * 0.997
    const token1Expect = token0Reserve * token1Reserve / token0Expect

    const token1Output = Math.floor((token1Reserve - token1Expect) * Math.pow(10, pairData.token1Decimals)) / Math.pow(10, pairData.token1Decimals)

    const token0SwapPrice = token1Output / token0Input
    const token1SwapPrice = token0Input / token1Output
    const token1OriginPrice = token0Reserve / token1Reserve
    const impactRate = (token1SwapPrice - token1OriginPrice) / token1SwapPrice

    const token1MinOut = Math.floor(token1Output * 0.995 * Math.pow(10, pairData.token1Decimals)) / Math.pow(10, pairData.token1Decimals)

    return {
        token0Price: token0SwapPrice,
        token1Price: token1SwapPrice,
        token1Output,
        impactRate,
        token1MinOut,
    }
}

export const swapPreviewPrice = async (tokenA, tokenB) => {
    const quotePrice = await swapQuotePrice(tokenA, tokenB)

    if (!quotePrice) {
        return false
    }

    return {
        amount: quotePrice.token1Output,
        tokenPriceA: quotePrice.token1Price,
        tokenPriceB: quotePrice.token0Price,
        impactRate: quotePrice.impactRate,
        minimumReceived: quotePrice.token1MinOut
    }
}

export const swapRequestTx = async (tokenA, tokenB) => {
    const routerContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ROUTER, CONTRACT_ADDRESS.ROUTER)
    const quotePrice = await swapQuotePrice(tokenA, tokenB)

    const ethIdx = filterdETH(tokenA.tokenAddress, tokenB.tokenAddress)

    if (ethIdx >= 0) {
        const token = [tokenA, tokenB][1 - ethIdx]
        const ethToken = [tokenA, tokenB][ethIdx]

        if (ethIdx === 0) {
            // ETH -> Token
            await metaMaskSendTx({
                from: await getMetaMaskMyAccount(),
                to: CONTRACT_ADDRESS.ROUTER,
                data: routerContract.methods.swapExactETHForTokens(
                    bigInt(Math.floor(quotePrice.token1MinOut * Math.pow(10, token.decimals))).value,
                    [
                        checkETH(ethToken.tokenAddress),
                        token.tokenAddress
                    ],
                    await getMetaMaskMyAccount(),
                    Math.floor((+new Date()) / 1000) + 3600
                ).encodeABI(),
                value: Math.floor(ethToken.amount * Math.pow(10, ethToken.decimals))
            })
        } else if (ethIdx === 1) {
            // Token -> ETH
            await metaMaskSendTx({
                from: await getMetaMaskMyAccount(),
                to: CONTRACT_ADDRESS.ROUTER,
                data: routerContract.methods.swapExactTokensForETH(
                    convertDecimal(token.balance, token.decimals) === token.amount
                        ? bigInt(token.balance).value
                        : bigInt(Math.floor(token.amount * Math.pow(10, token.decimals))).value,
                    bigInt(Math.floor(quotePrice.token1MinOut * Math.pow(10, ethToken.decimals))).value,
                    [
                        token.tokenAddress,
                        checkETH(ethToken.tokenAddress)
                    ],
                    await getMetaMaskMyAccount(),
                    Math.floor((+new Date()) / 1000) + 3600
                ).encodeABI(),
                value: 0x0
            })
        }
    } else {
        // Token -> Token
        await metaMaskSendTx({
            from: await getMetaMaskMyAccount(),
            to: CONTRACT_ADDRESS.ROUTER,
            data: routerContract.methods.swapExactTokensForTokens(
                convertDecimal(tokenA.balance, tokenA.decimals) === tokenA.amount
                    ? bigInt(tokenA.balance).value
                    : bigInt(Math.floor(tokenA.amount * Math.pow(10, tokenA.decimals))).value,
                bigInt(Math.floor(quotePrice.token1MinOut * Math.pow(10, tokenB.decimals))).value,
                [
                    tokenA.tokenAddress,
                    tokenB.tokenAddress
                ],
                await getMetaMaskMyAccount(),
                Math.floor((+new Date()) / 1000) + 3600
            ).encodeABI(),
            value: 0x0
        })
    }
}
// #endregion