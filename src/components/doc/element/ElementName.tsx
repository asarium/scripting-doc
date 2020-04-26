import {createStyles, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DocumentationElement} from "fso-ts-generator";
import React, {useContext} from "react";
import {When} from "react-if";
import {useDocStore} from "../../../state/useStores";
import {MatchRange} from "../../../worker/SearchWorker";

const useStyles = makeStyles((theme: Theme) => createStyles({
        letterHighlight: {
            backgroundColor: theme.palette.primary.main,
        },
    }),
);

interface IProps {
    element: DocumentationElement;
    showFullPath: boolean;
}

const NameHightlightContext = React.createContext<MatchRange[] | null>(null);

export const NameHightlightProvider: React.FC<{ matchRange: MatchRange[] }> = ({matchRange, children}) => {
    return <NameHightlightContext.Provider value={matchRange}>{children}</NameHightlightContext.Provider>;
};

const ElementName: React.FC<IProps> = ({element, showFullPath}) => {
    const documentationStore = useDocStore();
    const matchRange = useContext(NameHightlightContext);
    const styles = useStyles();

    let fullPathContent;
    if (showFullPath) {
        const parentPath = documentationStore.getElementParentPath(element);
        fullPathContent = parentPath.map(p => (
            <Typography component="span" color="textSecondary" key={p.id}>
                {p.shortName.length > 0 ? p.shortName : p.name}.
            </Typography>
        ));
    }

    let nameContent;
    if (matchRange !== null) {
        nameContent = [];

        let currentPos = 0;
        const name = element.name;
        for (const range of matchRange) {
            if (currentPos < range[0]) {
                nameContent.push(<span key={nameContent.length}>{name.substr(currentPos,
                    range[0] - currentPos)}</span>);
                currentPos = range[0];
            }
            nameContent.push(<span key={nameContent.length} className={styles.letterHighlight}>{name.substr(range[0],
                range[1] - range[0] + 1)}</span>);
            currentPos = range[1] + 1;
        }
        // Check if something is left over
        if (currentPos < name.length) {
            nameContent.push(<span key={nameContent.length}>{name.substr(currentPos,
                name.length - currentPos)}</span>);
        }
    } else {
        nameContent = element.name;
    }

    return (
        <span style={{marginLeft: "3px", marginRight: "3px"}}>
            {fullPathContent}
            <Typography variant="h6" component="span">{nameContent}</Typography>
            <When condition={element.shortName !== ""}>
                <Typography style={{marginLeft: "3px"}} variant="subtitle1" component="span">
                    ({element.shortName})
                </Typography>
            </When>
        </span>
    );
};

export default ElementName;
