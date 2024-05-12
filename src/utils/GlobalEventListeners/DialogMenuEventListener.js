class DialogMenuEventListener {
    constructor() {
        this.callbacks = {};

        window.addEventListener("show_dm", this.handleShowDialogMenuEvent); // show and
        window.addEventListener("hide_dm", this.handleHideDialogMenuEvent); // hide dialog menu
    }

    handleShowDialogMenuEvent = (e) => {
        this.callbacks.show(e);
    }

    handleHideDialogMenuEvent = (e) => {
        this.callbacks.hide(e);
    }

    register = (show, hide) => {
        this.callbacks = {
            show,
            hide
        }
    }
}

export default new DialogMenuEventListener();