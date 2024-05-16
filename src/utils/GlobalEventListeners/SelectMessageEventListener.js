class SelectMessageEventListener {
    constructor() {
        this.messagesData = [];
        this.callbacks = {};

        window.addEventListener("select_message", this.handleSelectMessage);
        window.addEventListener("clear_selecteds", this.handleClearSelecteds);
    }

    handleClearSelecteds = () => {
        this.messagesData = [];
    }

    handleSelectMessage = (e) => {
        if (e.detail.selected){
            this.messagesData.push(e.detail.messageData);
        }else {
            this.messagesData = this.messagesData.filter(messageData => messageData.message._id !== e.detail.messageData.message._id);
        }
        this.callbacks.selectMessages(this.messagesData);
    }

    register = (selectMessages) => {
        this.callbacks = {
            selectMessages
        };
    }
}

export default new SelectMessageEventListener();