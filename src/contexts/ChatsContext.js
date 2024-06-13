import {createContext, useReducer} from "react";
import DateHelper from "../utils/DateHelper";

export const ChatsContext = createContext(null);
export const ChatsDispatchContext = createContext(null);

export function ChatsProvider({chatsInitial, children}){
    const [chats, dispatch] = useReducer(chatsReducer, chatsInitial);

    return (
        <ChatsContext.Provider value={chats}>
            <ChatsDispatchContext.Provider value={dispatch}>
                {children}
            </ChatsDispatchContext.Provider>
        </ChatsContext.Provider>
    )
}

function chatsReducer(chats, action){
    switch (action.type){
        case "messageAdded": {
            const temp = getImmutableChatObject(chats, action.chatId);

            const formattedSendDate = DateHelper.getFormattedDate(action.message.datetime);

            temp.get(action.chatId).lastMessage = action.message;
            if (!temp.get(action.chatId).messages.get(formattedSendDate)) {
                temp.get(action.chatId).messages.set(formattedSendDate, [action.message]);
            } else {
                temp.get(action.chatId).messages.get(formattedSendDate).push(action.message);
            }

            return temp;
        }
        case "manyMessagesAdded": {
            const temp = getImmutableChatsMap(chats);

            for (const message of action.messages){
                const formattedSendDate = DateHelper.getFormattedDate(message.datetime);

                const currentChat = temp.get(message.chatId);
                if (!currentChat.messages.get(formattedSendDate)){
                    currentChat.messages.set(formattedSendDate, [message]);
                }else {
                    currentChat.messages.get(formattedSendDate).push(message);
                }
                currentChat.lastMessage = message;
            }

            return temp;
        }
        case "messageDeleted": {
            const temp = getImmutableChatObject(chats, action.chatId);

            const messages = temp.get(action.chatId).messages.get(action.messageData.date).filter(msg => msg._id !== action.messageData.message._id);
            temp.get(action.chatId).messages.set(action.messageData.date, [...messages]);

            if (messages.length === 0) {
                temp.get(action.chatId).messages.delete(action.messageData.date);
            } else {
                temp.get(action.chatId).messages.set(action.messageData.date, messages);
            }

            if (temp.get(action.chatId).lastMessage._id === action.messageData.message._id && messages.length !== 0) {
                temp.get(action.chatId).lastMessage = temp.get(action.chatId).messages.get(action.messageData.date).at(-1);
            } else {
                if (Array.from(temp.get(action.chatId).messages).at(-1)) {
                    temp.get(action.chatId).lastMessage = Array.from(temp.get(action.chatId).messages).at(-1)[1].at(-1);
                } else {
                    temp.get(action.chatId).lastMessage = null;
                }
            }

            return temp;
        }
        case "manyMessagesDeleted": {
            const temp = getImmutableChatsMap(chats);

            for (const messageData of action.messagesData){
                const dateMessages = temp.get(messageData.message.chatId).messages.get(messageData.date).filter(msg => msg._id !== messageData.message._id);
                if (dateMessages.length === 0) temp.get(messageData.message.chatId).messages.delete(messageData.date);
                else temp.get(messageData.message.chatId).messages.set(messageData.date, dateMessages);

                if (Array.from(temp.get(messageData.message.chatId).messages).at(-1)) {
                    temp.get(messageData.message.chatId).lastMessage = Array.from(temp.get(messageData.message.chatId).messages).at(-1)[1].at(-1);
                }else {
                    temp.get(messageData.message.chatId).lastMessage = null;
                }
            }

            return temp;
        }
        case "messageEdited": {
            const temp = getImmutableChatObject(chats, action.chatId);

            let editedMessage;
            temp.get(action.chatId).messages.get(action.messageData.date).filter(msg => msg._id === action.messageData.message._id).map(msg => {
                msg.text = action.text;
                msg.edited = true;
                editedMessage = msg;
                return editedMessage;
            });

            if (temp.get(action.chatId).lastMessage._id === action.messageData.message._id) {
                temp.get(action.chatId).lastMessage = editedMessage;
            }

            return temp;
        }
        default:
            throw Error("Unknown action: " + action.type);
    }
}

function getImmutableChatObject(chats, chatId){
    let temp = new Map();

    for (const [id, chatObject] of chats){
        if (id === chatId){
            temp.set(chatId, {
                ...chats.get(chatId),
                messages: new Map(),
            });
            continue;
        }

        temp.set(id, {...chatObject});
    }

    for (const [date, messages] of chats.get(chatId).messages){
        temp.get(chatId).messages.set(date, [...messages]);
    }

    return temp;
}

function getImmutableChatsMap(chats){
    const temp = new Map();

    for (const [chatId, chatObject] of chats){
        temp.set(chatId, {
            ...chats.get(chatId),
            messages: new Map(),
        });

        for (const [date, messages] of chatObject.messages){
            temp.get(chatId).messages.set(date, [...messages]);
        }
    }

    return temp;
}