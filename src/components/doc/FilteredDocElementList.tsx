import {Box} from "@material-ui/core";
import React from "react";
import {documentationStore} from "../../state/DocumentationStore";
import {FilteredDocumentationElement} from "../../worker/SearchWorker";
import FilteredDocumentationElementView from "./FilteredDocumentationElementView";

interface IProps {
    elements: FilteredDocumentationElement[];
}

const FilteredDocElementList: React.FC<IProps> = (props) => {
    const {elements} = props;

    return (
        <Box>
            {elements.map((el) => (
                <FilteredDocumentationElementView element={el} key={documentationStore.getElementAnchor(el.element)}/>
            ))}
        </Box>
    );
};

export default FilteredDocElementList;
