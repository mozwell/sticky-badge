function EaseInOutCubic(k: number) {
	return (k *= 2) < 1 ? 0.5 * k * k * k : 0.5 * ((k -= 2) * k * k + 2)
}

function QuarticEaseIn(k: number) {
	return k * k * k * k
}

export default {
	EaseInOutCubic,
	QuarticEaseIn
}
