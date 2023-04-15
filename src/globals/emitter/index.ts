import mitt from 'mitt'

class Emitter {
    eventBus
    async init() {
        this.eventBus = mitt()
    }
}
export default new Emitter()
