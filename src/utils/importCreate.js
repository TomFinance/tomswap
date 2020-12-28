import Web3 from "web3"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "config"
import { accountLocalStorage } from "./utils"
import { metaMaskSendTx } from "./metaMask"

const etherWeb3 = new Web3(window.ethereum)

export const getTokenBalance = async (tokenAddress, account) => {
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

    return ({
        '0': prices.token1Price,
        '1': prices.token0Price,
    })
}

export const getCheckPairContract = async (tokenAddressA, tokenAddressB) => {
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(tokenAddressA, tokenAddressB).call()

    return Number(pairAddress) !== 0
}

export const createCheckApprove = async (tokenAddress, amount, decimals) => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    const tokenAllowance = await token0Contract.methods.allowance(accountLocalStorage.getMyAccountAddress(), CONTRACT_ADDRESS.ROUTER).call()

    return tokenAllowance >= Number(amount) * Math.pow(10, decimals)
}

export const createConfirmApprove = async (tokenAddress, amount, decimals) => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    const tokenAllowance = await token0Contract.methods.allowance(accountLocalStorage.getMyAccountAddress(), CONTRACT_ADDRESS.ROUTER).call()

    if (Number(tokenAllowance) < Number(amount) * Math.pow(10, decimals)) {
        await metaMaskSendTx({
            from: accountLocalStorage.getMyAccountAddress(),
            to: tokenAddress,
            data: token0Contract.methods.approve(
                CONTRACT_ADDRESS.ROUTER,
                (2n ** 256n - 1n).toString()
            ).encodeABI()
        })
    }
}

export const createImportCreate = async (aToken, bToken) => {
    const routerContract = new etherWeb3.eth.Contract(CONTRACT_ABI.ROUTER, CONTRACT_ADDRESS.ROUTER)

    etherWeb3.utils.toChecksumAddress(accountLocalStorage.getMyAccountAddress())
    etherWeb3.utils.toChecksumAddress(CONTRACT_ADDRESS.ROUTER)
    etherWeb3.utils.toChecksumAddress(aToken.tokenAddress)
    etherWeb3.utils.toChecksumAddress(bToken.tokenAddress)

    await metaMaskSendTx({
        from: accountLocalStorage.getMyAccountAddress(),
        to: CONTRACT_ADDRESS.ROUTER,
        data: routerContract.methods.addLiquidity(
            aToken.tokenAddress,
            bToken.tokenAddress,
            Number(aToken.amount) * Math.pow(10, aToken.decimals),
            Number(bToken.amount) * Math.pow(10, bToken.decimals),
            Number(aToken.amount) * Math.pow(10, aToken.decimals),
            Number(bToken.amount) * Math.pow(10, bToken.decimals),
            accountLocalStorage.getMyAccountAddress(),
            Math.floor((+new Date()) / 1000) + 3600
        ).encodeABI(),
        value: 0x0
    })
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
    const token0Decimals = await token0Contract.methods.decimals().call()
    const token1Decimals = await token1Contract.methods.decimals().call()

    const tokenReserves = await pairContract.methods.getReserves().call()
    const token0Reserve = pairToken0 === tokenAddressA ? tokenReserves._reserve0 : tokenReserves._reserve1
    const token1Reserve = pairToken1 === tokenAddressB ? tokenReserves._reserve1 : tokenReserves._reserve0

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

export const addLiquidityPreview = async (aToken, bToken) => {
    const pairData = await addLiquidityGatherPairData(aToken.tokenAddress, bToken.tokenAddress)

    if (!pairData) {
        return false
    }

    const token0Reserve = (pairData.token0Reserve / Math.pow(10, pairData.token0Decimals))
    const token1Reserve = (pairData.token1Reserve / Math.pow(10, pairData.token1Decimals))

    const token0Price = token1Reserve / token0Reserve
    // const token1Price = token0Reserve / token1Reserve

    const calcTokenAmountB = aToken.amount * token0Price

    const pairSupply = pairData.pairSupply / Math.pow(10, pairData.pairDecimals)

    // console.log(`Reserve 0 : ${token0Reserve}<br>Reserve 1 : ${token1Reserve}<br>Supply : ${pairSupply}`)

    const token0Expect = token0Reserve + Number(aToken.amount)
    const token1Expect = token1Reserve + Number(calcTokenAmountB)
    const totalShare = Math.sqrt(token0Expect * token1Expect / 1e36 * Math.pow(10, pairData.token0Decimals) * Math.pow(10, pairData.token1Decimals))

    // console.log(totalShare, pairSupply, totalShare - pairSupply)

    // console.log(`Reserve 0 : ${token0Expect}<br>Reserve 1 : ${token1Expect}<br>Sqrt K : ${totalShare}<br>Delta Share : ${totalShare - pairSupply}<br>As rate : `)

    const calcText = await createPreviewPrice(aToken, { ...bToken, amount: calcTokenAmountB })

    return {
        '0': calcText['0'],
        '1': calcText['1'],
        '2': `${((totalShare - pairSupply) / totalShare * 100)}`,
        '3': calcTokenAmountB,
    }
}