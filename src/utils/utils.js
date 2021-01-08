import { ETH_ADDRESS, WETH_ADDRESS } from "config"

export const positionLocalStorage = {
    getMyPositionList: () => {
        return JSON.parse(localStorage.getItem('myPositionList'))
    },

    setMyPositionList: (tokenAddressA, tokenAddressB) => {
        const sortingData = [tokenAddressA, tokenAddressB].sort()
        const savePosition = `${sortingData[0]}_${sortingData[1]}`

        const myPositionList = JSON.parse(localStorage.getItem('myPositionList')) || []
        const tempSetList = new Set([...myPositionList, savePosition])

        return localStorage.setItem('myPositionList', JSON.stringify([...tempSetList]))
    },

    removeMyPositionList: (tokenAddressA, tokenAddressB) => {
        const sortingData = [tokenAddressA, tokenAddressB].sort()
        const savePosition = `${sortingData[0]}_${sortingData[1]}`

        const myPositionList = JSON.parse(localStorage.getItem('myPositionList')) || []
        const tempSetList = new Set([...myPositionList])
        tempSetList.delete(savePosition)

        return localStorage.setItem('myPositionList', JSON.stringify([...tempSetList]))
    }
}

export const convertDecimal = (value, decimals, persent) => {
    let calcValue = Number(value)

    if (calcValue < 0) {
        return '0.00000000000'
    }

    if (decimals) {
        calcValue = calcValue * Math.pow(0.1, decimals)
    }

    if (persent) {
        calcValue *= persent
    }

    return calcValue < 0.1
        ? calcValue.toFixed(100).slice(0, 14)
        : calcValue.toPrecision(12)
}

export const checkETH = address => {
    return address === ETH_ADDRESS ? WETH_ADDRESS : address
}

export const filterdETH = (tokenAddressA, tokenAddressB) => {
    return [tokenAddressA, tokenAddressB].indexOf(ETH_ADDRESS)
}