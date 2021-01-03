import { Grid, Typography } from "@material-ui/core";
import { IteratorType, ListType, MapType, TupleType, TypeSpecifier } from "fso-ts-generator";
import React from "react";
import { useDocStore } from "../../state/useStores";
import ElementLink from "./ElementLink";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { AlternativeType, FunctionType, FunctionTypeParameter, VarargsType } from "fso-ts-generator/dist/build/scripting";
import { When } from "react-if";

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
            <Typography style={{ marginRight: "2px" }} component="span"
                color="textSecondary">{"{"}</Typography>
            <DocumentationType type={type.element} />
            <Typography style={{ marginLeft: "5px", marginRight: "5px" }} component="span"
                color="textSecondary">...</Typography>
            <Typography style={{ marginLeft: "2px" }} component="span"
                color="textSecondary">{"}"}</Typography>
        </>
    );
}

function renderCompositType(type: TupleType | AlternativeType, separator: string) {
    const elements = [<DocumentationType type={type.elements[0]} key={"type-0"} />];
    for (let i = 1; i < type.elements.length; ++i) {
        elements.push(<Typography style={{ marginRight: "3px" }} component="span"
            color="textSecondary" key={"comma-" + i}>{separator}</Typography>);
        elements.push(<DocumentationType type={type.elements[i]} key={"type-" + i} />);
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
            <Typography style={{ marginRight: "1px" }} component="span"
                color="textSecondary">{"Iterator<"}</Typography>
            <DocumentationType type={type.element} />
            <Typography style={{ marginLeft: "1px" }} component="span"
                color="textSecondary">{">"}</Typography>
        </>
    );
}

function renderMapType(type: MapType) {
    return (
        <>
            <Typography style={{ marginRight: "2px" }} component="span"
                color="textSecondary">{"{"}</Typography>
            <DocumentationType type={type.key} />
            <Typography style={{ marginLeft: "5px", marginRight: "5px" }} component="span"
                color="textSecondary">&#10140;</Typography>
            <DocumentationType type={type.key} />
            <Typography style={{ marginLeft: "5px", marginRight: "5px" }} component="span"
                color="textSecondary">...</Typography>
            <Typography style={{ marginLeft: "2px" }} component="span"
                color="textSecondary">{"}"}</Typography>
        </>
    );
}

function renderVarargs(type: VarargsType): React.ReactNode {
    return (
        <>
            {renderType(type.baseType)}
            <Typography style={{ marginLeft: "1px", marginRight: "2px" }} component="span"
                color="textSecondary">...</Typography>
        </>
    );
}

const FunctionTypeParameterElement: React.FC<{parameter: FunctionTypeParameter}> = ({ parameter }) => {
    return (
        <>
            <When condition={parameter.name.length > 0}>
                <Typography component="span" color="textPrimary">{parameter.name}</Typography>
                <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                    color="textSecondary">: </Typography>
            </When>
            {renderType(parameter.type)}
        </>
    );
};

function renderFunction(type: FunctionType): React.ReactNode {
    let parameters = null;
    if (type.parameters.length > 0) {
        // Reduce does not like empty arrays so we check for the empty case here just to make sure
        parameters = type.parameters
            .map<React.ReactNode>((param, i) => (
                <FunctionTypeParameterElement parameter={param} key={param.name || "param-" + i.toString()} />
            ))
            .reduce((prev, curr, i) => [prev, (
                <Typography key={"comma-" + i.toString()} style={{ marginLeft: "1px", marginRight: "1px" }}
                    component="span" color="textSecondary">, </Typography>
            ), curr]);
    }

    return (
        <>
            <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                color="textSecondary">function(</Typography>
            {parameters}
            <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                color="textSecondary">)</Typography>
            <Typography style={{ marginLeft: "5px", marginRight: "5px" }} component="span"
                color="textSecondary">&#10140;</Typography>
            {renderType(type.returnType)}
        </>
    );
}

function renderType(type: TypeSpecifier) {
    const documentationStore = useDocStore();

    if (typeof (type) === "string") {
        // Simple type so either a class or an internal type
        if (INTERNAL_TYPES.indexOf(type) !== -1) {
            return (
                <Typography variant="subtitle1" style={{ fontStyle: "italic" }} component="span">
                    {type}
                </Typography>
            );
        }

        const docEl = documentationStore.getClassElement(type);

        if (!docEl) {
            // Invalid type so just render as text
            return (
                <Typography variant="subtitle1" style={{ fontStyle: "italic" }} component="span">
                    {type}
                </Typography>
            );
        }

        // One of our types so add a Link for that
        return <ElementLink element={docEl} />;
    }

    switch (type.type) {
        case "list":
            return renderListType(type);
        case "tuple":
            return renderCompositType(type, ", ");
        case "iterator":
            return renderIteratorType(type);
        case "map":
            return renderMapType(type);
        case "alternative":
            return renderCompositType(type, " | ");
        case "varargs":
            return renderVarargs(type);
        case "function":
            return renderFunction(type);
    }
}

const DocumentationType: React.FC<IProps> = ({ type }) => {
    return (
        <span style={{ marginLeft: "2px", marginRight: "2px" }}>
            {renderType(type)}
        </span>
    );
};

export default DocumentationType;
