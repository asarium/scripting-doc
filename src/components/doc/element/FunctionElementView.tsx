import {Box, Typography} from "@material-ui/core";
import {CallElement} from "fso-ts-generator";
import React from "react";
import DocumentationType from "../DocumentationType";
import ElementDescription from "./ElementDescription";
import ElementName from "./ElementName";

interface IProps {
    element: CallElement;
    showFullPath: boolean;
}

const FunctionElementView: React.FC<IProps> = ({element, showFullPath}) => {
    return (
        <>
            <DocumentationType type={element.returnType}/>
            <ElementName element={element} showFullPath={showFullPath}/>
            <Typography style={{marginRight: "1px"}} component="span"
                        color="textSecondary">(</Typography>
            <Typography style={{marginLeft: "1px", marginRight: "1px"}} component="span"
                        color="textPrimary">{element.parameters}</Typography>
            <Typography style={{marginLeft: "1px"}} component="span"
                        color="textSecondary">)</Typography>
            <ElementDescription element={element}/>
            <Box marginLeft={1}>
                <Typography style={{fontWeight: "bold", marginRight: "4px"}} variant="body2" component="span"
                            color="textSecondary">Returns:</Typography>
                <Typography variant="body2" component="span"
                            color="textPrimary">{element.returnDocumentation}</Typography>
            </Box>
        </>
    );
};

export default FunctionElementView;
