import Web3 from "web3"
import bigInt from 'big-integer'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "config"
import { accountLocalStorage } from "./utils"
import { metaMaskSendTx } from "./metaMask"

const etherWeb3 = new Web3(window.ethereum)

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
    const factoryContract = new etherWeb3.eth.Contract(CONTRACT_ABI.FACTORY, CONTRACT_ADDRESS.FACTORY)
    const pairAddress = await factoryContract.methods.getPair(addLiquidityInputA.tokenAddress, addLiquidityInputB.tokenAddress).call()

    if (Number(pairAddress) !== 0) { return false }

    const prices = createCalculatePrice(addLiquidityInputA, addLiquidityInputB)
    if (!prices) { return false }

    return ({
        '0': prices.token1Price,
        '1': prices.token0Price,
    })
}

export const createCheckApprove = async (tokenAddress, amount) => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    const tokenAllowance = await token0Contract.methods.allowance(accountLocalStorage.getMyAccountAddress(), CONTRACT_ADDRESS.ROUTER).call()
    console.log("🚀 ~ file: importCreate.js ~ line 50 ~ createConfirmApprove ~ tokenAllowance", tokenAllowance)

    return tokenAllowance >= amount
}

export const createConfirmApprove = async (tokenAddress, amount) => {
    const token0Contract = new etherWeb3.eth.Contract(CONTRACT_ABI.ERC, tokenAddress)

    const tokenAllowance = await token0Contract.methods.allowance(accountLocalStorage.getMyAccountAddress(), CONTRACT_ADDRESS.ROUTER).call()

    if (Number(tokenAllowance) < amount) {
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

    console.log({
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

    // await metaMaskSendTx({
    //     from: accountLocalStorage.getMyAccountAddress(),
    //     to: CONTRACT_ADDRESS.ROUTER,
    //     data: routerContract.methods.addLiquidity(
    //         aToken.tokenAddress,
    //         bToken.tokenAddress,
    //         Number(aToken.amount) * Math.pow(10, aToken.decimals),
    //         Number(bToken.amount) * Math.pow(10, bToken.decimals),
    //         Number(aToken.amount) * Math.pow(10, aToken.decimals),
    //         Number(bToken.amount) * Math.pow(10, bToken.decimals),
    //         accountLocalStorage.getMyAccountAddress(),
    //         Math.floor((+new Date()) / 1000) + 3600
    //     ).encodeABI(),
    //     value: 0x0
    // })
}