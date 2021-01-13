import { ETH_ADDRESS, WETH_ADDRESS } from "config"

export const numberPattern = /(^\d+$)|(^\d+[.]\d{0,11}$)/

export const accountLocalStorage = {
    getMyAccount: () => {
        return JSON.parse(localStorage.getItem('myAccount'))
    },

    setMyAccount: account => {
        return localStorage.setItem('myAccount', JSON.stringify(account))
    },

    removeMyAccount: () => {
        return localStorage.removeItem('myAccount')
    }
}

export const networkLocalStorage = {
    getMyNetwork: () => {
        return JSON.parse(localStorage.getItem('myNetwork'))
    },

    setMyNetwork: network => {
        return localStorage.setItem('myNetwork', JSON.stringify(network))
    },

    removeMyNetwork: () => {
        return localStorage.removeItem('myNetwork')
    }
}

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

    if (isNaN(calcValue)) {
        return ''
    }

    if (calcValue <= 0) {
        return '0.00000000000'
    }

    if (decimals) {
        calcValue = calcValue / Math.pow(10, decimals)
    }

    if (persent) {
        calcValue *= persent
    }

    const temp = `${calcValue}`.includes('.') ? calcValue.toFixed(100).split('.') : [calcValue, '0'.repeat(12 - `${calcValue}`.length)]
    return `${temp[0]}.${temp[1].slice(0, 12 - (temp.length - 1))}`

}

export const checkETH = address => {
    return address === ETH_ADDRESS ? WETH_ADDRESS : address
}

export const filterdETH = (tokenAddressA, tokenAddressB) => {
    return [tokenAddressA, tokenAddressB].indexOf(ETH_ADDRESS)
}