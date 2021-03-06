import {createStyles, Fade, Theme} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import {observer} from "mobx-react-lite";
import React, {useRef} from "react";
import {When} from "react-if";
import {useDocStore} from "../state/useStores";
import { trace } from "mobx";

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
    const styles = useStyles();
    const documentationStore = useDocStore();
    const savedProgress = useRef(-1.0);

    const loadingState = documentationStore.currentLoadingState;

    if (!loadingState) {
        return null;
    }

    const hasDescription = loadingState.hasDescription;
    const determinate = !loadingState.indeterminate;

    // Avoid briefly showing 0% when switching to indeterminate
    if (determinate) {
        savedProgress.current = loadingState.progress;
    }
    const percentProgress = Math.round(Math.max(0, Math.min(1, savedProgress.current)) * 100);

    return (
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
                            {loadingState?.description}
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
    );
});

export default LoadingIndicator;
