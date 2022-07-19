import {Application, Container, Sprite, Ticker, Texture, InteractionEvent, utils} from "pixi.js";

export class Game extends utils.EventEmitter {

    static SCORED = 'scored'
    static GAMEOVER = 'gameover'

    // app is declared with '!' to allow delayed initialization
    // without triggering a TypeScript error
    private app!:Application
    private canvas!:HTMLCanvasElement
    private readonly bubbles:Array<Bubble>

    public score:number

    public constructor() {
        super()
        this.bubbles = []
        this.score = 0
    }

    // the app is initialized after construction to allow it
    // to be managed externally by the Vue component lifecycle
    // see: @/components/Game.vue
    public init(canvas:HTMLCanvasElement) {
        this.canvas = canvas
        this.app = new Application({
            view: canvas,
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundAlpha: 0,
        })
        this.score = 0

        for (let i = 0; i < 25; i++) {
            let bubble = new Bubble(0.75 + Math.random() * 0.5)
            bubble.x = 25 * Math.ceil(1280/25 * Math.random())
            bubble.y = 960 + (i * 100) + (50 * Math.random())
            bubble.on(Bubble.POPPED, this.bubblePopped, this)
            this.app.stage.addChild(bubble)
            this.bubbles.push(bubble)
        }

        Ticker.shared.add(this.update, this);
    }

    public cleanup() {
        Ticker.shared.remove(this.update, this)
        let bubble:Bubble
        for (let b in this.bubbles) {
            bubble = this.bubbles[b]
            bubble.removeListener(Bubble.POPPED, this.bubblePopped, this)
            this.app.stage.removeChild(bubble)
            bubble.destroy()
        }
        this.app.destroy()
    }

    public reset() {
        this.cleanup()
        this.init(this.canvas)
    }

    private bubblePopped(bubble:Bubble) {
        this.bubbles.splice(this.bubbles.indexOf(bubble), 1)
        this.app.stage.removeChild(bubble)
        this.score += Math.floor(bubble.y)
        this.emit(Game.SCORED)
        bubble.destroy()
    }

    private endGame() {
        Ticker.shared.remove(this.update, this)
        this.emit(Game.GAMEOVER)
    }

    private update(deltaTime: number): void {
        for (let b in this.bubbles) {
            this.bubbles[b].update(deltaTime)
        }
        if (this.bubbles.length === 0) {
            this.endGame()
        }
    }

}

export class Bubble extends Container {

    static POPPED = 'popped'

    private static readonly bubbleTexture = Texture.from('/bubble.png')
    private static readonly iconTextures = [
        Texture.from('/pixi-icon.svg'),
        Texture.from('/tauri-icon.svg'),
        Texture.from('/typescript-icon.svg'),
        Texture.from('/vite-icon.svg'),
        Texture.from('/vue-icon.svg'),
    ]
    private readonly icon:Sprite
    private readonly bubble:Sprite
    private readonly velocity:number

    constructor(scale:number) {
        super()

        this.scale.set(scale)
        this.velocity = Math.random() + scale/2 // between 0.375 - 1.750

        let icon = Bubble.iconTextures[Math.floor(Math.random() * Bubble.iconTextures.length)]
        this.icon = Sprite.from(icon)
        this.icon.anchor.set(0.5, 0.5)
        this.icon.width = 60
        this.icon.height = 60
        this.addChild(this.icon)

        this.bubble = Sprite.from(Bubble.bubbleTexture)
        this.bubble.anchor.set(0.5, 0.5)
        this.addChild(this.bubble)

        this.interactive = true
        this.on('pointerdown', this.pop, this)

        this.update = this.updateFloating
    }

    private pop(e:InteractionEvent) {
        this.removeChild(this.bubble)
        this.bubble.destroy()
        this.interactive = false
        this.update = this.updatePopping
    }

    public update:Function

    private updateFloating(dt:number) {
        this.y -= 5 * dt * this.velocity
        if (this.y < 0) {
            this.x = 25 * Math.ceil(1280/25 * Math.random())
            this.y = 1200
        }

        // make bubbles wobble as they rise
        // faster bubbles wobble faster
        let wobbleFreq = 3  // higher == more wobbles
        let wobbleDist = 10 // higher == further wobbles
        let wobble = Math.floor(wobbleDist * this.velocity * Math.sin(wobbleFreq * this.y/(100 * this.velocity)))
        this.icon.x = wobble
        this.bubble.x = wobble
    }

    private updatePopping(dt:number) {
        this.icon.alpha = this.icon.alpha - 0.1
        if (this.icon.alpha < 0.1) {
            this.emit(Bubble.POPPED, this)
            this.update = this.updateNothing
        }
    }

    private updateNothing(dt:number) {
        // wait to be cleaned up
    }
}

