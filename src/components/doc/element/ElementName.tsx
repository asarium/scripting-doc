import {Typography} from "@material-ui/core";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {When} from "react-if";
import {useDocStore} from "../../../state/useStores";

interface IProps {
    element: DocumentationElement;
    showFullPath: boolean;
}

const ElementName: React.FC<IProps> = ({element, showFullPath}) => {
    const documentationStore = useDocStore();

    let fullPathContent;
    if (showFullPath) {
        const parentPath = documentationStore.getElementParentPath(element);
        fullPathContent = parentPath.map(p => (
            <Typography component="span" color="textSecondary" key={p.id}>
                {p.shortName.length > 0 ? p.shortName : p.name}.
            </Typography>
        ));
    }

    return (
        <span style={{marginLeft: "3px", marginRight: "3px"}}>
            {fullPathContent}
            <Typography variant="h6" component="span">{element.name}</Typography>
            <When condition={element.shortName !== ""}>
                <Typography style={{marginLeft: "3px"}} variant="subtitle1" component="span">
                    ({element.shortName})
                </Typography>
            </When>
        </span>
    );
};

export default ElementName;
