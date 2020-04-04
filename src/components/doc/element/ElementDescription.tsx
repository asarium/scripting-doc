import {Box} from "@material-ui/core";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import Markup from "../Markup";

interface IProps {
    element: DocumentationElement;
}

const ElementDescription: React.FC<IProps> = ({element}) => {
    return (
        <Box marginLeft={1}>
            <Markup content={element.description}/>
        </Box>
    );
};

export default ElementDescription;
