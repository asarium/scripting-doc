import {Typography} from "@material-ui/core";
import {LibraryElement} from "fso-ts-generator";
import React from "react";
import ElementDescription from "./ElementDescription";
import ElementName from "./ElementName";

interface IProps {
    element: LibraryElement;
    showFullPath: boolean;
}

const LibraryElementView: React.FC<IProps> = ({element,  showFullPath}) => {
    return (
        <>
            <Typography style={{marginRight: "5px"}} component="span" color="textSecondary">
                Library
            </Typography>
            <ElementName element={element} showFullPath={showFullPath}/>
            <ElementDescription element={element}/>
        </>
    );
};

export default LibraryElementView;
