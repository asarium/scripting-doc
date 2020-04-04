import {Box, createStyles, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {documentationStore} from "../../state/DocumentationStore";
import DocumentationElementView from "./DocumentationElementView";

const useStyles = makeStyles<Theme, IProps>((theme: Theme) => createStyles({
        depthIndicator: props => ({
            borderLeft: props.topLevel ? undefined : `1px dashed ${theme.palette.primary.main}`,
        }),
    }),
);

interface IProps {
    elements: DocumentationElement[];
    topLevel?: boolean;
}

const DocElementList: React.FC<IProps> = (props) => {
    const {elements, topLevel = false} = props;

    const classes = useStyles(props);

    return (
        <Box className={classes.depthIndicator} paddingLeft={topLevel ? 0.0 : 1.0}>
            {elements.map((el) => <DocumentationElementView element={el}
                                                            key={documentationStore.getElementAnchor(el)}/>)}
        </Box>
    );
};

export default DocElementList;
