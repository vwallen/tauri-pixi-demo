import { Application, Graphics } from "pixi.js";

export class Game {

    // app is declared with '!' to allow delayed initialization
    // without triggering a TypeScript error
    private app!:Application

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
    }
}



