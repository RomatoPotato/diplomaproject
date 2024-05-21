import "./ChatTabCheckbox.css"

export default function ChatTabCheckbox({chat, checked, onChange}) {
    let icon;

    if (chat.type === "dialog") {
        icon = chat.interlocutor.icon;
    } else {
        icon = chat.icon;
    }

    if (!icon || icon === "") {
        icon = chat.type === "dialog" ? "static/images/user.png" : "static/images/group.png";
    }

    return (
        <div className="chat-tab-checkbox">
            <label className="chat-tab-checkbox__label">
                <img className="chat-tab-checkbox__icon" src={icon} alt=""/>
                <div className="chat-tab-checkbox__desc">
                    <p className="chat-tab-checkbox__title">{chat.name}</p>
                    {chat.type !== "dialog" &&
                        <p className="chat-tab-checkbox__group_name">
                            {chat.type === "mainGroup" ?
                                "Главная группа" :
                                chat.group.name
                            }
                        </p>
                    }
                </div>
                <input
                    className="chat-tab-checkbox__checkbox"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                        const value = e.target.checked;
                        //setIsChecked(value);
                        onChange(value);
                    }}/>
            </label>
            <div className="chat-tab__delimiter"></div>
        </div>
    )
};