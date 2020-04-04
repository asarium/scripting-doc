import {Typography} from "@material-ui/core";
import {ClassElement} from "fso-ts-generator";
import React from "react";
import {When} from "react-if";
import {documentationStore} from "../../../state/DocumentationStore";
import ElementLink from "../ElementLink";
import ElementDescription from "./ElementDescription";
import ElementName from "./ElementName";

interface IProps {
    element: ClassElement;
    showFullPath: boolean;
}

const ClassElementView: React.FC<IProps> = ({element, showFullPath}) => {
    return (
        <>
            <Typography style={{marginRight: "5px"}} component="span" color="textSecondary">
                Class
            </Typography>
            <ElementName element={element} showFullPath={showFullPath}/>
            <When condition={element.superClass !== ""}>{() => (
                <>
                    <Typography style={{marginLeft: "2px", marginRight: "2px"}} component="span"
                                color="textSecondary">extends</Typography>
                    <ElementLink element={documentationStore.getClassElementOrFail(element.superClass)}/>
                </>
            )}
            </When>
            <ElementDescription element={element}/>
        </>
    );
};

export default ClassElementView;
