class GlobalEventListener {
    constructor() {
        window.addEventListener("show_cm", this.handleShowContextMenuEvent);
        window.addEventListener("hide_cm", this.handleHideContextMenuEvent);
    }

    handleShowContextMenuEvent = (e) => {
        this.callbacks.show(e);
    }

    handleHideContextMenuEvent = (e) => {
        this.callbacks.hide(e);
    }

    register = (show, hide) => {
        this.callbacks = {
            show,
            hide
        }
    }
}

export default new GlobalEventListener();