import { calcConnectedPath, CircleData } from './math'
import Easing from './easing'
import { bubbleBurstSound } from './audio'
import { setCSSVariable } from './dom'

export function handleMouseDown(e: MouseEvent | TouchEvent) {
	e.preventDefault()
	this._dragData.hasStarted = true
	this._dragData.startX =
		e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
	this._dragData.startY =
		e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY
}

export function handleMouseMove(e: MouseEvent | TouchEvent) {
	e.preventDefault()
	if (this._dragData.hasStarted) {
		const currentX =
			e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
		const currentY =
			e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY
		const distanceX = currentX - this._dragData.startX
		const distanceY = currentY - this._dragData.startY
		const BURST_LIMIT = 350
		if (Math.sqrt(distanceX ** 2 + distanceY ** 2) > BURST_LIMIT) {
			this._rootEl.parentNode.removeChild(this._rootEl)
			bubbleBurstSound()
			this.onclear()
			return
		}
		const cx = this._fixCircle.cx + distanceX
		const cy = this._fixCircle.cy + distanceY
		const dragR =
			this._fixCircle.r *
			((Math.abs(distanceX) + Math.abs(distanceY)) * 0.003 + 1)
		const fixR =
			this._fixCircle.r *
			((Math.abs(distanceX) + Math.abs(distanceY)) * -0.003 + 1)
		this._dragCircleEl.setAttribute('cx', String(cx))
		this._dragCircleEl.setAttribute('cy', String(cy))
		this._dragCircleEl.setAttribute(
			'r',
			dragR > 13 ? String(13) : String(dragR)
		)
		this._fixCircleEl.setAttribute('r', fixR < 3 ? String(3) : String(fixR))
		this._pathEl.setAttribute(
			'd',
			calcConnectedPath(
				{
					cx: this._fixCircle.cx,
					cy: this._fixCircle.cy,
					r: fixR < 3 ? 3 : fixR
				},
				{
					cx,
					cy,
					r: dragR > 13 ? 13 : dragR
				}
			)
		)
	}
}

export function handleMouseUp(e: MouseEvent) {
	e.preventDefault()
	console.log('up')
	resumeDragCircle(
		this._fixCircle,
		this._fixCircleEl,
		this._dragCircleEl,
		this._pathEl,
		this._rootEl
	)
	this._dragData.hasStarted = false
}

export function resumeDragCircle(
	fixCircle: CircleData,
	fixEl: SVGElement,
	dragEl: SVGElement,
	pathEl: SVGElement,
	rootEl: SVGElement
) {
	const currentDragCircle = {
		cx: +dragEl.getAttribute('cx'),
		cy: +dragEl.getAttribute('cy'),
		r: +dragEl.getAttribute('r')
	}
	// setAttrs(dragEl, fixCircle)
	animate([fixEl, dragEl], [fixCircle, fixCircle], 150, (elArr) => {
		pathEl.setAttribute('d', calcConnectedPath(elArr[0], elArr[1]))
		/** PLAY SHAKE ANIMATION WHEN RESUME ANIMATION ENDS */
		if (elArr[0].cx === elArr[1].cx && elArr[0].cy === elArr[1].cy) {
			const SHAKE_RATIO = 0.1
			const moveX = fixCircle.cx - currentDragCircle.cx
			const moveY = fixCircle.cy - currentDragCircle.cy
			setCSSVariable(rootEl, '--shake-cx', `${moveX * SHAKE_RATIO}px`)
			setCSSVariable(rootEl, '--shake-cy', `${moveY * SHAKE_RATIO}px`)
			fixEl.classList.add('shake')
			dragEl.classList.add('shake')
			dragEl.addEventListener('animationend', (e) => {
				fixEl.classList.remove('shake')
				dragEl.classList.remove('shake')
			})
		}
	})()
}

/** ANIMATE THE ELEMENT -- TIME-BASED */
export function animate(
	elArr: Element | Element[],
	propsArr: any | any[],
	duration: number,
	callback?: Function,
	easingName: string = 'QuarticEaseIn'
) {
	let handle
	return () => {
		const startTime = +performance.now().toFixed(0)
		cancelAnimationFrame(handle)
		const _makeFrame = () => {
			const currentTime = +performance.now().toFixed(0)
			if (!(elArr instanceof Array)) {
				elArr = [elArr]
			}
			if (!(propsArr instanceof Array)) {
				propsArr = [propsArr]
			}
			let currentPropsArr = []
			elArr.forEach((el, index) => {
				let currentProps = {}
				Object.keys(propsArr[index]).forEach((prop) => {
					const startValue = +el.getAttribute(prop)
					const endValue = +propsArr[index][prop]
					const totalMoveAtFrame =
						(endValue - startValue) *
						Easing[easingName]((currentTime - startTime) / duration)
					const currentValue = totalMoveAtFrame + startValue
					currentProps[prop] = currentValue
					el.setAttribute(prop, String(currentValue))
					currentPropsArr[index] = currentProps
				})
			})
			callback(currentPropsArr)
			if ((currentTime - startTime) / duration < 1) {
				handle = requestAnimationFrame(_makeFrame)
			} else {
				/** RENDER THE LAST FRAME */
				elArr.forEach((el, index) => {
					let currentProps = {}
					Object.keys(propsArr[index]).forEach((prop) => {
						const endValue = +propsArr[index][prop]
						currentProps[prop] = endValue
						el.setAttribute(prop, String(endValue))
						currentPropsArr[index] = currentProps
					})
				})
				callback(currentPropsArr)
				cancelAnimationFrame(handle)
			}
		}
		handle = requestAnimationFrame(_makeFrame)
	}
}
