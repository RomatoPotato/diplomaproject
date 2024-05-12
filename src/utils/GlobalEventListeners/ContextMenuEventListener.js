class ContextMenuEventListener {
    constructor() {
        this.callbacks = {};

        window.addEventListener("show_cm", this.handleShowContextMenuEvent); // show and
        window.addEventListener("hide_cm", this.handleHideContextMenuEvent); // hide context menu
    }

    handleShowContextMenuEvent = (e) => {
        this.callbacks.show(e);

        // for (const name in this.callbacks){
        //     console.log(Object.prototype.hasOwnProperty.call(this.callbacks, name))
        //     if (Object.prototype.hasOwnProperty.call(this.callbacks, name)) {
        //         this.callbacks[name].show(e);
        //     }
        // }
    }

    handleHideContextMenuEvent = (e) => {
        this.callbacks.hide(e);
        // for (const name in this.callbacks) {
        //     if (Object.prototype.hasOwnProperty.call(this.callbacks, name)) {
        //         this.callbacks[name].hide(e);
        //     }
        // }
    }

    register = (show, hide) => {
        this.callbacks = {
            show,
            hide
        }
    }
}

export default new ContextMenuEventListener();