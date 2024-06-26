import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./ContextMenu.css";
import listener, {show} from "../../../utils/GlobalEventListeners/ShowModalsEventListener";

let nextItemId = 0;

export const ContextMenu = ({name, contextMenuItems}) => {
    const [pos, setPos] = useState({x: 0, y: 0});
    const [isShown, setIsShown] = useState(false);
    const [data, setData] = useState(null);
    const [hideItemData, setHideItemData] = useState();
    const contextMenuRef = useRef();

    const open = (e) => {
        setData(e.detail.data);
        setHideItemData(e.detail.data.hideData);
        setIsShown(true);
        setPosition(e.detail.data.pos.x, e.detail.data.pos.y);
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

    const close = useCallback(() => {
        if (isShown) {
            setIsShown(false);
        }
    }, [isShown]);

    const closeOnOutsideClick = useCallback((e) => {
        if (isShown) {
            if (!contextMenuRef.current.contains(e.target)) {
                setIsShown(false);
            }
        }
    }, [isShown])

    listener.register(name, open, close);

    useEffect(() => {
        window.addEventListener("click", closeOnOutsideClick);
        window.addEventListener("wheel", close);
        window.addEventListener("contextmenu", close);

        return () => {
            window.removeEventListener("click", closeOnOutsideClick);
            window.removeEventListener("wheel", close);
            window.removeEventListener("contextmenu", close);
        }
    }, [close, closeOnOutsideClick]);

    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
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

export const ContextMenuTrigger = ({name, children, notShowCondition, triggerData, ...attrs}) => {
    return (
        <div {...attrs} onContextMenu={(e) => {
            if (!notShowCondition) {
                e.preventDefault();
                e.stopPropagation();

                const x = e.clientX;
                const y = e.clientY;

                show(name, {
                    ...triggerData,
                    pos: {x, y}
                });
            }
        }}>
            {children}
        </div>
    )
}