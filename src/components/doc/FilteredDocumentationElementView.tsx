import {Box} from "@material-ui/core";
import React from "react";
import {documentationStore} from "../../state/DocumentationStore";
import {FilteredDocumentationElement} from "../../worker/SearchWorker";
import ElementContent from "./element/ElementContent";

interface IProps {
    element: FilteredDocumentationElement;
}

const DocumentationElementView: React.FC<IProps> = ({element}) => {
    return (
        <Box id={documentationStore.getElementAnchor(element.element)}>
            <ElementContent element={element.element} showFullPath={true}/>
        </Box>
    );
};

export default DocumentationElementView;
