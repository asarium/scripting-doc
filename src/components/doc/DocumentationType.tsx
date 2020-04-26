import {Typography} from "@material-ui/core";
import {IteratorType, ListType, MapType, TupleType, TypeSpecifier} from "fso-ts-generator";
import React from "react";
import {useDocStore} from "../../state/useStores";
import ElementLink from "./ElementLink";

interface IProps {
    type: TypeSpecifier;
}

const INTERNAL_TYPES = [
    "nil",
    "boolean",
    "light userdata",
    "number",
    "string",
    "table",
    "function",
    "userdata",
    "thread",

    "void",
];

function renderListType(type: ListType) {
    return (
        <>
            <Typography style={{marginRight: "2px"}} component="span"
                        color="textSecondary">{"{"}</Typography>
            <DocumentationType type={type.element}/>
            <Typography style={{marginLeft: "5px", marginRight: "5px"}} component="span"
                        color="textSecondary">...</Typography>
            <Typography style={{marginLeft: "2px"}} component="span"
                        color="textSecondary">{"}"}</Typography>
        </>
    );
}

function renderTupleType(type: TupleType) {
    const elements = [<DocumentationType type={type.elements[0]} key={"type-0"}/>];
    for (let i = 1; i < type.elements.length; ++i) {
        elements.push(<Typography style={{marginRight: "3px"}} component="span"
                                  color="textSecondary" key={"comma-" + i}>,</Typography>);
        elements.push(<DocumentationType type={type.elements[i]} key={"type-" + i}/>);
    }

    return (
        <>
            {elements}
        </>
    );
}

function renderIteratorType(type: IteratorType) {
    return (
        <>
            <Typography style={{marginRight: "1px"}} component="span"
                        color="textSecondary">{"Iterator<"}</Typography>
            <DocumentationType type={type.element}/>
            <Typography style={{marginLeft: "1px"}} component="span"
                        color="textSecondary">{">"}</Typography>
        </>
    );
}

function renderMapType(type: MapType) {
    return (
        <>
            <Typography style={{marginRight: "2px"}} component="span"
                        color="textSecondary">{"{"}</Typography>
            <DocumentationType type={type.key}/>
            <Typography style={{marginLeft: "5px", marginRight: "5px"}} component="span"
                        color="textSecondary">=</Typography>
            <DocumentationType type={type.key}/>
            <Typography style={{marginLeft: "5px", marginRight: "5px"}} component="span"
                        color="textSecondary">...</Typography>
            <Typography style={{marginLeft: "2px"}} component="span"
                        color="textSecondary">{"}"}</Typography>
        </>
    );
}

function renderType(type: TypeSpecifier) {
    const documentationStore = useDocStore();

    if (typeof (type) === "string") {
        // Simple type so either a class or an internal type
        if (INTERNAL_TYPES.indexOf(type) !== -1) {
            return (
                <Typography variant="subtitle1" component="span">
                    {type}
                </Typography>
            );
        }

        const docEl = documentationStore.getClassElement(type);

        if (!docEl) {
            // Invalid type so just render as text
            return (
                <Typography variant="subtitle1" component="span">
                    {type}
                </Typography>
            );
        }

        // One of our types so add a Link for that
        return <ElementLink element={docEl}/>;
    }

    switch (type.type) {
        case "list":
            return renderListType(type);
        case "tuple":
            return renderTupleType(type);
        case "iterator":
            return renderIteratorType(type);
        case "map":
            return renderMapType(type);
    }
}

const DocumentationType: React.FC<IProps> = ({type}) => {
    return (
        <span style={{marginLeft: "2px", marginRight: "2px"}}>
            {renderType(type)}
        </span>
    );
};

export default DocumentationType;
