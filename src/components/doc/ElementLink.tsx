import {createStyles, Theme} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {makeStyles} from "@material-ui/core/styles";
import {DocumentationElement} from "fso-ts-generator";
import React from "react";
import {useDocStore} from "../../state/useStores";

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
    const documentationStore = useDocStore();

    const onClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const targetElement = document.getElementById(documentationStore.getElementAnchor(element));

        if (!targetElement) {
            return;
        }

        targetElement.scrollIntoView(true);
    };

    return (
        <Link className={styles.elementLink}
              onClick={onClick}
              variant="subtitle1">{element.name}</Link>
    );
};

export default ElementLink;
