import Box from "@material-ui/core/Box";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {useDocStore} from "../../state/useStores";
import DocumentationElementView from "./DocumentationElementView";

interface IProps {
    elements: DocumentationElement[];
}

const DocElementList: React.FC<IProps> = ({elements}) => {
    const documentationStore = useDocStore();

    return (
        <Box>
            {elements.map((el) => <DocumentationElementView element={el}
                                                            key={documentationStore.getElementAnchor(el)}/>)}
        </Box>
    );
};

export default DocElementList;
