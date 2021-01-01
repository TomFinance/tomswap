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

    removeMyPositionList: () => {
        return localStorage.removeItem('myPositionList')
    }
}

export const convertDecimal = (value, decimals, persent) => {
    return persent
        ? Number(value * Math.pow(0.1, decimals) * persent).toPrecision(12)
        : Number(value * Math.pow(0.1, decimals)).toPrecision(12)
}

export const checkETH = address => {
    return address === ETH_ADDRESS ? WETH_ADDRESS : address
}

export const filterdETH = (tokenAddressA, tokenAddressB) => {
    return [tokenAddressA, tokenAddressB].indexOf(ETH_ADDRESS)
}