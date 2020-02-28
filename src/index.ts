import {
	customElement, //
	html,
	LitElement,
	property,
	query
} from 'lit-element'
import { calcConnectedPath } from './utils/math'
import {
	handleMouseDown,
	handleMouseMove,
	handleMouseUp
} from './utils/interact'
import style from './style.scss'

/** REGISTER THE CUSTOM ELEMENT */
@customElement('sticky-badge')

/** YOUR WEB COMPONENT CLASS */
export class StickyBadge extends LitElement {
	/** DECLARE AND INITIALIZE INTERNAL STATE */
	private _dragData = {
		startX: 0,
		startY: 0,
		targetX: 200,
		targetY: 300,
		hasStarted: false
	}
	private _fixCircle = { cx: 100, cy: 150, r: 10 }
	private _dragCircle = { ...this._fixCircle }

	/** GET DOM OF ELEMENTS */
	@query('#sticky-badge-wrapper')
	private _rootEl: SVGElement
	@query('#fix-circle')
	private _fixCircleEl: SVGElement
	@query('#drag-circle')
	private _dragCircleEl: SVGElement
	@query('path')
	private _pathEl: SVGElement

	/** DECLARE AND INITIALIZE PROPS */
	@property({ type: Number }) size = 10
	@property({ type: Number }) number = 0
	@property({ type: Number }) max = 99
	@property({ type: String }) background = 'purple'
	@property({ type: Function }) onclear = () => {
		console.log('the badge is cleared.')
	}

	/** REGISTER IMPORTED STYLE SHEET */
	static get styles() {
		return [style] as any
	}

	firstUpdated() {
		super.connectedCallback()
		// console.log([this._fixCircleEl, this._dragCircleEl])
	}

	handleMouseDown(e: MouseEvent | TouchEvent) {
		handleMouseDown.call(this, e)
	}

	handleMouseMove(e: MouseEvent | TouchEvent) {
		handleMouseMove.call(this, e)
	}

	handleMouseUp(e: MouseEvent | TouchEvent) {
		handleMouseUp.call(this, e)
	}

	/** RENDER TEMPLATE */
	render() {
		const connectedPath = calcConnectedPath(this._fixCircle, this._dragCircle)
		return html`
			<svg
				id="sticky-badge-wrapper"
				width="700"
				height="700"
				@mousemove="${this.handleMouseMove}"
				@mouseup="${this.handleMouseUp}"
				@touchmove="${this.handleMouseMove}"
				@touchend="${this.handleMouseUp}"
			>
				<circle
					id="fix-circle"
					cx=${this._fixCircle.cx}
					cy=${this._fixCircle.cy}
					r=${this._fixCircle.r}
					fill=${this.background}
				/>
				<path d=${connectedPath} fill=${this.background} />
				<circle
					id="drag-circle"
					cx=${this._dragCircle.cx}
					cy=${this._dragCircle.cy}
					r=${this._dragCircle.r}
					fill=${this.background}
					@mousedown="${this.handleMouseDown}"
					@touchstart="${this.handleMouseDown}"
				></circle>
				<!-- <text x="50%" y="50%" text-anchor="middle" stroke="yellow">5</text> -->
			</svg>
		`
	}
}
