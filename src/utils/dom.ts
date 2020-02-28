/** A SHORTCUT FOR SETTING MULTIPLE ATTRIBUTES ON AN ELEMENT */
export const setAttrs = (el: Element, dataObj: any) => {
	Object.keys(dataObj).forEach((key) => {
		el.setAttribute(key, String(dataObj[key]))
	})
}

/** 设置任一元素的 CSS 变量 */
export const setCSSVariable = (
	el: HTMLElement | SVGElement | string,
	prop: string,
	val: string
) => {
	if (typeof el === 'string') {
		;(document.querySelector(el) as HTMLElement | SVGElement).style.setProperty(
			prop,
			val
		)
	} else {
		el.style.setProperty(prop, val)
	}
}
