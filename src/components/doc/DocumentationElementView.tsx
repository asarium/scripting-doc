import {Box} from "@material-ui/core";

import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {When} from "react-if";
import {documentationStore} from "../../state/DocumentationStore";
import DocElementList from "./DocElementList";
import ElementContent from "./element/ElementContent";

interface IProps {
    element: DocumentationElement;
}

const DocumentationElementView: React.FC<IProps> = ({element}) => {
    return (
        <Box id={documentationStore.getElementAnchor(element)}>
            <ElementContent element={element}/>
            <When condition={element.children.length > 0}>
                <DocElementList elements={element.children}/>
            </When>
        </Box>
    );
};

export default DocumentationElementView;
