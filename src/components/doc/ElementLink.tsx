import {createStyles, Theme, Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {makeStyles} from "@material-ui/core/styles";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {documentationStore} from "../../state/DocumentationStore";

const useStyles = makeStyles((theme: Theme) => createStyles({
        elementLink: {
            color: theme.palette.primary.light,
        },
    }),
);

interface IProps {
    element: DocumentationElement;
}

const ElementLink: React.FC<IProps> = ({element}) => {
    const styles = useStyles();

    return (
        <Link className={styles.elementLink}
              href={"#" + documentationStore.getElementAnchor(element)} variant="subtitle1">{element.name}</Link>
    );
};

export default ElementLink;
