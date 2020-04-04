import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import ClassElementView from "./ClassElementView";
import FunctionElementView from "./FunctionElementView";
import LibraryElementView from "./LibraryElementView";
import PropertyElementView from "./PropertyElementView";

interface IProps {
    element: DocumentationElement;
    showFullPath?: boolean;
}

const ElementContent: React.FC<IProps> = ({element, showFullPath = false}) => {
    switch (element.type) {
        case "class":
            return <ClassElementView element={element} showFullPath={showFullPath}/>;
        case "library":
            return <LibraryElementView element={element} showFullPath={showFullPath}/>;
        case "function":
        case "operator":
            return <FunctionElementView element={element} showFullPath={showFullPath}/>;
        case "property":
            return <PropertyElementView element={element} showFullPath={showFullPath}/>;
        default:
            throw new Error("Unknown element type.");
    }
};

export default ElementContent;
