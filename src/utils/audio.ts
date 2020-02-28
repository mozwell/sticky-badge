class Sound {
	context: AudioContext
	oscillator: OscillatorNode
	gainNode: GainNode

	constructor(context: AudioContext) {
		this.context = context
	}

	init() {
		this.oscillator = this.context.createOscillator()
		this.gainNode = this.context.createGain()
		this.oscillator.connect(this.gainNode)
		this.gainNode.connect(this.context.destination)
		this.oscillator.type = 'sine'
	}

	play(value: number, time: number) {
		this.init()
		this.oscillator.frequency.value = value
		this.gainNode.gain.setValueAtTime(1, this.context.currentTime)
		this.oscillator.start(time)
		this.stop(time)
	}

	stop(time: number) {
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1)
		this.oscillator.stop(time + 1)
	}
}

export const bubbleBurstSound = () => {
	const context = new window.AudioContext()
	const note = new Sound(context)
	const now = context.currentTime
	note.play(83.66, now)
}
