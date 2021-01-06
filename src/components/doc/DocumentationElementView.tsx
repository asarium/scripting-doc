import {Box} from "@material-ui/core";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {useDocStore} from "../../state/useStores";
import DocElementList from "./DocElementList";
import ElementContent from "./element/ElementContent";

const ExpansionPanel = withStyles({
    root:     {
        border:               "1px solid rgba(0, 0, 0, .125)",
        boxShadow:            "none",
        "&:not(:last-child)": {
            borderBottom: 0,
        },
        "&:before":           {
            display: "none",
        },
        "&$expanded":         {
            margin: "auto",
        },
    },
    expanded: {},
})(Accordion);

const ExpansionPanelSummary = withStyles({
    root:     {
        backgroundColor: "rgba(0, 0, 0, .03)",
        borderBottom:    "1px solid rgba(0, 0, 0, .125)",
        marginBottom:    -1,
        minHeight:       56,
        "&$expanded":    {
            minHeight: 56,
        },
    },
    content:  {
        "&$expanded": {
            margin: "12px 0",
        },
    },
    expanded: {},
})(AccordionSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(AccordionDetails);

interface IProps {
    element: DocumentationElement;
}

const DocumentationElementView: React.FC<IProps> = ({element}) => {
    const documentationStore = useDocStore();
    const [expanded, setExpanded] = React.useState(false);

    let content;
    if (element.children.length > 0) {
        content = (
            <ExpansionPanel TransitionProps={{unmountOnExit: true, mountOnEnter: true}} expanded={expanded}
                            onChange={(_evt, open) => setExpanded(open)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Box>
                        <ElementContent element={element}/>
                    </Box>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <DocElementList elements={element.children}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    } else {
        content = (
            <ElementContent element={element}/>
        );
    }

    return (
        <Box id={documentationStore.getElementAnchor(element)}>
            {content}
        </Box>
    );
};

export default DocumentationElementView;
