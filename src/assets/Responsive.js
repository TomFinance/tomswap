const breakPoint = {
	xLarge: 1200,
	mobile: 768,
}

const mq = n => {
	const bpArray = Object.keys(breakPoint).map(key => [key, breakPoint[key]])
	const [result] = bpArray.reduce((acc, [name, size]) => {
		if (n === name) return [...acc, `@media (max-width: ${size}px)`]
		return acc
	}, [])
	return result
}

export {
	mq
}