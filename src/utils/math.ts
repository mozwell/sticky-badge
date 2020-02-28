export interface PointData {
	x: number
	y: number
}
export interface CircleData {
	cx: number
	cy: number
	r: number
}

export const toPoint = (data: CircleData): PointData => {
	return {
		x: data.cx,
		y: data.cy
	}
}

export const toCircle = (data: PointData, r: number): CircleData => {
	return {
		cx: data.x,
		cy: data.y,
		r
	}
}

/** CALCULATE THE DISTANCE BETWEEN TWO POINTS */
export const calcDistance = (start: PointData, end: PointData): number => {
	const diffX = end.x - start.x
	const diffY = end.y - start.y
	return Math.sqrt(diffX ** 2 + diffY ** 2)
}

/** CALCULATE THE SLOPE BETWEEN TWO POINTS */
export const calcSlope = (start: PointData, end: PointData): number => {
	const diffX = end.x - start.x
	const diffY = end.y - start.y
	return diffY / diffX || 0 // IF EQUALS TO NAN, RETURN 0
}

/** CALCULATE THE POINT AT A CERTAIN PERCENTAGE BETWEEN TWO POINTS */
export const calcPercentPoint = (
	start: PointData,
	end: PointData,
	percent: number
): PointData => {
	const diffX = end.x - start.x
	const diffY = end.y - start.y
	const percentX = start.x + diffX * percent
	const percentY = start.y + diffY * percent
	return { x: percentX, y: percentY }
}

/** CALCULATE THE MIDPOINT BETWEEN TWO POINTS */
export const calcMidpoint = (start: PointData, end: PointData): PointData => {
	return calcPercentPoint(start, end, 0.5)
}

/** CALCULATE THE POINT OF TANGENCY BETWEEN A CIRCLE & A LINE */
export const calcPointOfTangency = (
	circle: CircleData,
	slope: number
): [PointData, PointData] => {
	/** SEEK THE SOLUTION OF slope*x-y+k=0 & x**2+y**2=radius**2 */
	/** FOR A TANGENT LINE, THE DELTA EQUALS TO 0 (b**2-4ac) */
	const absK = Math.sqrt(circle.r ** 2 * (1 + slope ** 2))
	/** CALCULATE THE ROOTS */
	const calcRootCoords = (k: number) => {
		const x = (-k * slope) / (slope ** 2 + 1)
		const y = slope * x + k
		return { x, y }
	}
	const firstRoot = calcRootCoords(absK)
	const secondRoot = calcRootCoords(-absK)

	return [
		{ x: circle.cx + firstRoot.x, y: circle.cy + firstRoot.y },
		{ x: circle.cx + secondRoot.x, y: circle.cy + secondRoot.y }
	]
}

/** CALCULATE THE PATH OF THE CONNECTED AREA BETWEEN TWO CIRCLES */
export const calcConnectedPath = (
	fixCircle: CircleData,
	dragCircle: CircleData
): string => {
	const midpoint = calcMidpoint(toPoint(fixCircle), toPoint(dragCircle))
	const slope = calcSlope(toPoint(fixCircle), toPoint(dragCircle))
	const fixPointsOfTangency = calcPointOfTangency(fixCircle, slope)
	const dragPointsOfTangency = calcPointOfTangency(dragCircle, slope)

	return `
		M ${fixPointsOfTangency[0].x} ${fixPointsOfTangency[0].y}
		Q ${midpoint.x} ${midpoint.y} ${dragPointsOfTangency[0].x} ${dragPointsOfTangency[0].y}
		L ${dragPointsOfTangency[1].x} ${dragPointsOfTangency[1].y}
		Q ${midpoint.x} ${midpoint.y} ${fixPointsOfTangency[1].x} ${fixPointsOfTangency[1].y}
		Z
	`
}
