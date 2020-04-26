import {Box} from "@material-ui/core";
import React from "react";
import {useDocStore} from "../../state/useStores";
import {FilteredDocumentationElement} from "../../worker/SearchWorker";
import FilteredDocumentationElementView from "./FilteredDocumentationElementView";

interface IProps {
    elements: FilteredDocumentationElement[];
}

const FilteredDocElementList: React.FC<IProps> = ({elements}) => {
    const documentationStore = useDocStore();

    return (
        <Box>
            {elements.slice(0, 20).map((el) => (
                <FilteredDocumentationElementView element={el} key={documentationStore.getElementAnchor(el.element)}/>
            ))}
        </Box>
    );
};

export default FilteredDocElementList;
