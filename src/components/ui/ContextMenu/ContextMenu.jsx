import React, {useEffect, useRef, useState} from 'react';
import "./ContextMenu.css";
import listener from "../../../utils/GlobalEventListeners/ContextMenuEventListener";

let nextItemId = 0;

export const ContextMenu = ({contextMenuItems}) => {
    const [pos, setPos] = useState({x: 0, y: 0});
    const [isShown, setIsShown] = useState(false);
    const [data, setData] = useState(null);
    const [hideItemData, setHideItemData] = useState();
    const contextMenuRef = useRef();

    const open = (e) => {
        setData(e.detail.data);
        setHideItemData(e.detail.data.hideData);
        setIsShown(true);
        setPosition(e.detail.pos.x, e.detail.pos.y);
    }

    const close = () => {
        if (isShown) {
            setIsShown(false);
        }
    }

    const closeOnOutsideClick = (e) => {
        if (!contextMenuRef.current.contains(e.target)) {
            close();
        }
    }

    const setPosition = (x, y) => {
        const {innerWidth, innerHeight} = window;
        const contextMenuRect = contextMenuRef.current.getBoundingClientRect();

        if (x + contextMenuRect.width > innerWidth) {
            x -= contextMenuRect.width;
        }

        if (y + contextMenuRect.height > innerHeight) {
            y -= contextMenuRect.height;
        }

        setPos({x, y});
    }

    listener.register(open, close);

    useEffect(() => {
        window.addEventListener("click", closeOnOutsideClick);
        window.addEventListener("wheel", close);
        window.addEventListener("contextmenu", close);

        return () => {
            window.removeEventListener("click", closeOnOutsideClick);
            window.removeEventListener("wheel", close);
            window.removeEventListener("contextmenu", close);
        }
    });

    return (
        <div
            ref={contextMenuRef}
            className="context-menu"
            style={{
                opacity: isShown ? 1 : 0,
                pointerEvents: isShown ? "all" : "none",
                left: pos.x,
                top: pos.y
            }}>
            {contextMenuItems.map(item =>
                !(item.hasOwnProperty("hideCondition") && hideItemData &&
                    item.hideCondition[hideItemData.name] === hideItemData.value) &&
                <div
                    key={nextItemId++}
                    className={"context-menu__item" + (item.isDanger ? " context-menu__item_danger" : "")}
                    onClick={() => {
                        item.onClick && item.onClick(data);
                        close();
                    }}>
                    {item.text}
                </div>
            )}
        </div>
    );
};

export const ContextMenuTrigger = ({children, notShowCondition, data, ...attrs}) => {
    return (
        <div {...attrs} onContextMenu={(e) => {
            if (!notShowCondition) {
                hide();

                e.preventDefault();
                e.stopPropagation();

                const x = e.clientX;
                const y = e.clientY;

                show(e, x, y, data);
            }
        }}>
            {children}
        </div>
    )
}

const show = (event, x, y, data) => {
    const eventShow = new CustomEvent("show_cm", {
        detail: {
            pos: {x, y},
            target: event.currentTarget,
            data
        }
    });
    window.dispatchEvent(eventShow);
}

const hide = () => {
    const eventHide = new CustomEvent("hide_cm");
    window.dispatchEvent(eventHide);
}