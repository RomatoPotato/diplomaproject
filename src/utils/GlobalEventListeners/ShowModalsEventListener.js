class ShowModalsEventListener {
    constructor() {
        this.callbacks = {};

        window.addEventListener("show", this.handleShowEvent);
        window.addEventListener("hide", this.handleHideEvent);
    }

    handleShowEvent = (e) => {
        this.callbacks[e.detail.name].show(e);
    }

    handleHideEvent = (e) => {
        this.callbacks[e.detail.name].hide(e);
    }

    register = (name, show, hide) => {
        this.callbacks[name] = {
            show,
            hide
        }
    }
}

export const show = (name, data) => {
    const eventShow = new CustomEvent("show", {
        detail: {data, name}
    });
    window.dispatchEvent(eventShow);
}

export const hide = (name) => {
    const eventHide = new CustomEvent("hide", {
        detail: {name}
    });
    window.dispatchEvent(eventHide);
}

export default new ShowModalsEventListener();