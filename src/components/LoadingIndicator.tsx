import {createStyles, Fade, Theme} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import {observer} from "mobx-react";
import React, {useRef, useState} from "react";
import {When} from "react-if";
import {documentationStore} from "../state/DocumentationStore";
import {IndexState, indexStore} from "../state/IndexStore";

const useStyles = makeStyles((theme: Theme) => createStyles({
    progressWrapper: {
        width:    "100%",
        maxWidth: "350px",
    },
    percentSpacing:  {
        margin: theme.spacing(0.0, 1.0),
    },
}));

const LoadingIndicator: React.FC = observer(() => {
    const hasDescription = !!documentationStore.loadingDescription &&
        documentationStore.loadingDescription.length > 0;
    const determinate = documentationStore.loadingProgress >= 0.0;
    const styles = useStyles();

    // Avoid briefly showing 0% when switching to indeterminate
    const savedProgress = useRef(documentationStore.loadingProgress);
    if (determinate) {
        savedProgress.current = documentationStore.loadingProgress;
    }
    const percentProgress = Math.round(Math.max(0, Math.min(1, savedProgress.current)) * 100);

    return (
        <Fade
            in={indexStore.indexState === IndexState.Loading}
            style={{
                transitionDelay: indexStore.indexState === IndexState.Loading ? "800ms" : "0ms",
            }}
            unmountOnExit
        >
            <Box
                display="flex"
                width="100%"
                height="100%"
                maxHeight={400}
                alignItems="center"
                justifyContent="center"
            >
                <Box display="block" className={styles.progressWrapper}>
                    <Box justifyContent="center">
                        <LinearProgress style={{width: "100%"}}
                                        variant={determinate ? "determinate" : "indeterminate"}
                                        value={percentProgress}
                        />
                    </Box>
                    <When condition={hasDescription}>
                        <Box display="flex" alignItems="center" justifyContent="center" m={1}>
                            <Typography color="textPrimary" component="span">
                                {documentationStore.loadingDescription}
                            </Typography>
                            <Fade in={determinate} unmountOnExit>
                                <Typography className={styles.percentSpacing} color="textSecondary" component="span">
                                    {percentProgress}%
                                </Typography>
                            </Fade>
                        </Box>
                    </When>
                </Box>
            </Box>
        </Fade>
    );
});

export default LoadingIndicator;
