export const accountLocalStorage = {
    getMyAccountAddress: () => {
        return localStorage.getItem('accountAddress')
    },

    setMyAccountAddress: value => {
        return localStorage.setItem('accountAddress', value)
    },

    removeMyAccountAddress: () => {
        return localStorage.removeItem('accountAddress')
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

    removeMyPositionList: () => {
        return localStorage.removeItem('myPositionList')
    }
}

export const conventDecimal = (accountBalance, decimals) => {
    return (accountBalance / Math.pow(10, decimals)).toFixed(decimals)
}