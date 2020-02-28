export class PreciseNumber extends Number {
	private _val: number

	constructor(val: number) {
		super(val)
		this._val = val
	}

	val() {
		return this._val
	}

	add(...args: number[]) {
		let r1, r2, m
		args.forEach((arg) => {
			try {
				r1 = this._val.toString().split('.')[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg.toString().split('.')[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2))
			this._val = Math.round(this._val * m + arg * m) / m
		})
		return this
	}

	sub(...args: number[]) {
		let r1, r2, m
		args.forEach((arg) => {
			try {
				r1 = this._val.toString().split('.')[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg.toString().split('.')[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2))
			const n = r1 >= r2 ? r1 : r2
			this._val = +(Math.round(this._val * m - arg * m) / m).toFixed(n)
		})
		return this
	}

	mul(...args: number[]) {
		args.forEach((arg) => {
			let m = 0,
				s1 = this._val.toString(),
				s2 = arg.toString()
			try {
				m += s1.split('.')[1].length
			} catch (e) {}
			try {
				m += s2.split('.')[1].length
			} catch (e) {}
			this._val =
				(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
				Math.pow(10, m)
		})
		return this
	}

	div(...args: number[]) {
		const DEFAULT_FLOAT = 2
		args.forEach((arg) => {
			let t1 = 0,
				t2 = 0,
				r1,
				r2
			try {
				t1 = this._val.toString().split('.')[1].length
			} catch (e) {}
			try {
				t2 = arg.toString().split('.')[1].length
			} catch (e) {}
			r1 = Number(this._val.toString().replace('.', ''))
			r2 = Number(arg.toString().replace('.', ''))
			const tempResult = (r1 / r2) * Math.pow(10, t2 - t1)
			this._val = +tempResult.toFixed(DEFAULT_FLOAT)
		})
		return this
	}
}
