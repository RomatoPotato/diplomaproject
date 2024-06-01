import React from 'react';
import "./Table.css";

const Table = ({className, children}) => {
    return (
        <table className={(className ? className : "")}>
            {children}
        </table>
    );
};

const TableHead = ({children}) => {
    return (
        <thead className="better-table-head">
        {children}
        </thead>
    );
};

const TableBody = ({children}) => {
    return (
        <tbody>
        {children}
        </tbody>
    );
};

const TableRow = ({children}) => {
    return (
        <tr className="better-table-row">
            {children}
        </tr>
    );
};

const TableCell = ({colSpan, style, className, children}) => {
    return (
        <td colSpan={colSpan} className={"better-table-cell " + (className ? className : "")}>
            <div style={style} className="better-table-cell__content ">
                {children}
            </div>
        </td>
    );
};

const TableActionCell = ({text, children}) => {
    return (
        <td className="table-action-cell">
            <div className="table-action-cell__content">
                <div className="table-action-cell__text">{text}</div>
                <div className="table-action-cell__actions-box">
                    {children}
                </div>
            </div>
        </td>
    );
};

export {TableHead, TableBody, TableRow, TableCell, TableActionCell};
export default Table;