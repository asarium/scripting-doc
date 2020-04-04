import {Typography} from "@material-ui/core";
import {PropertyElement} from "fso-ts-generator";
import React from "react";
import {Else, If, Then} from "react-if";
import DocumentationType from "../DocumentationType";
import ElementDescription from "./ElementDescription";
import ElementName from "./ElementName";

interface IProps {
    element: PropertyElement;
    showFullPath: boolean;
}

const PropertyElementView: React.FC<IProps> = ({element, showFullPath}) => {
    return (
        <>
            <DocumentationType type={element.getterType}/>
            <ElementName element={element} showFullPath={showFullPath}/>
            <If condition={element.setterType === ""}>
                <Then>
                    <Typography style={{marginLeft: "5px", marginRight: "5px"}} component="span"
                                color="textSecondary">(Read only)</Typography>
                </Then>
                <Else>
                    <Typography style={{marginLeft: "5px", marginRight: "5px"}} component="span"
                                color="textSecondary">=</Typography>
                    <DocumentationType type={element.setterType}/>
                </Else>
            </If>
            <ElementDescription element={element}/>
        </>
    );
};

export default PropertyElementView;
