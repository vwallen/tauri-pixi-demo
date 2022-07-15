import {Application, Container, Loader, Sprite, Ticker, Texture, Graphics} from "pixi.js";

export class Game {

    // app is declared with '!' to allow delayed initialization
    // without triggering a TypeScript error
    private app!:Application
    private bubbles:Array<Bubble>

    public constructor() {
        this.bubbles = []
    }

    // the app is initialized after construction to allow it
    // to be managed externally by the Vue component lifecycle
    // see: @/components/Game.vue
    public init(canvas:HTMLCanvasElement) {
        this.app = new Application({
            view: canvas,
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundAlpha: 0,
        })

        for (let i = 0; i < 100; i++) {
            let bubble = new Bubble(0.75 + Math.random() * 0.5)
            bubble.x = 25 * Math.ceil(1280/25 * Math.random())
            bubble.y = i * 100 + 1280 + 25 * Math.ceil(960/25 * Math.random())
            this.app.stage.addChild(bubble)
            this.bubbles.push(bubble)
        }

        Ticker.shared.add(this.update, this);
    }

    private update(deltaTime: number): void {
        for (let b in this.bubbles) {
            this.bubbles[b].update(deltaTime)
        }
    }

}

export class Bubble extends Container {

    private static readonly bubbleTexture = Texture.from('./src/assets/bubble.png')
    private static readonly iconTextures = [
        Texture.from('./src/assets/pixi-icon.svg'),
        Texture.from('./src/assets/tauri-icon.svg'),
        // Texture.from('./src/assets/typescript-icon.svg'),
        // Texture.from('./src/assets/vite-icon.svg'),
        Texture.from('./src/assets/vue-icon.svg'),
    ]
    private readonly icon:Sprite
    private readonly bubble:Sprite
    private readonly velocity:number

    constructor(scale:number) {
        super()

        this.scale.set(scale)
        this.velocity = Math.random() + scale // between 0.75 - 2.50

        let icon = Bubble.iconTextures[Math.floor(Math.random() * Bubble.iconTextures.length)]
        this.icon = Sprite.from(icon)
        this.icon.anchor.set(0.5, 0.5)
        this.icon.width = 60
        this.icon.height = 60
        this.addChild(this.icon)

        this.bubble = Sprite.from(Bubble.bubbleTexture)
        this.bubble.anchor.set(0.5, 0.5)
        this.addChild(this.bubble)
    }

    public update(dt:number) {
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

}

