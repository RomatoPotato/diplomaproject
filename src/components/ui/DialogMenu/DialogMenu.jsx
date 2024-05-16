import React, {useState} from 'react';
import "./DialogMenu.css";
import Dialog from "../components/Dialog/Dialog";
import listener from "../../../utils/GlobalEventListener";

const DialogMenu = ({name, title, items}) => {
    const [isShown, setIsShown] = useState(false);

    const open = () => {
        setIsShown(true);
    }

    const close = () => {
        if (isShown) {
            setIsShown(false);
        }
    }

    listener.register(name, open, close);

    return (
        <Dialog isShown={isShown} className="dialog-menu">
            <p className="dialog-menu__title">{title}</p>
            <div className="dialog-menu__items-box">
                {items.map(item => !item.hideCondition &&
                    <div
                        className={"dialog-menu__item" + (item.isDanger ? " dialog-menu__item_danger" : "")}
                        key={item.text}
                        onClick={() => {
                            close();
                            item.onClick();
                        }}>
                        {item.text}
                    </div>
                )}
                <div className="dialog-menu__item" onClick={close}>Отменить</div>
            </div>
        </Dialog>
    );
};

export default DialogMenu;