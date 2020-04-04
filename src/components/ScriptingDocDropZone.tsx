import {createStyles, Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import * as React from "react";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {Case, Default, Switch} from "react-if";
import {documentationStore} from "../state/DocumentationStore";
import {delay} from "../util/delay";

const useStyles = makeStyles((theme: Theme) => createStyles({
    dropzone: {
        flex:            1,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        marginTop:       10,
        padding:         20,
        borderWidth:     2,
        borderRadius:    2,
        borderColor:     theme.palette.primary.light,
        borderStyle:     "dashed",
        backgroundColor: theme.palette.background.paper,
        outline:         "none",
        transition:      "border .24s ease-in-out",
    },
    active:   {
        borderColor: theme.palette.primary.main,
    },
    accept:   {
        borderColor: theme.palette.success.main,
    },
    reject:   {
        borderColor: theme.palette.warning.main,
    },
}));

const ScriptingDocDropZone: React.FC = () => {
    const styles = useStyles();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length < 1) {
            return;
        }

        const loadCallbacks = documentationStore.getDocumentationLoadOperation();

        loadCallbacks.startLoading();
        loadCallbacks.setIndeterminateProgress("Reading file");

        const content = await acceptedFiles[0].text();

        try {
            loadCallbacks.setIndeterminateProgress("Parsing JSON");

            const parsedObject = JSON.parse(content);
            loadCallbacks.finishedLoading(parsedObject);
        } catch (e) {
            console.log(e);
        }
    }, []);

    const {
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
          } = useDropzone({
        accept:   "application/json",
        multiple: false,
        onDrop,
    });

    const containerClasses = classNames(styles.dropzone, {
        [styles.active]: isDragActive,
        [styles.accept]: isDragAccept,
        [styles.reject]: isDragReject,
    });

    return (
        <div {...getRootProps({className: containerClasses})}>
            <input {...getInputProps()} />
            <Switch>
                <Case condition={isDragReject}>
                    <Typography color="textSecondary" component="p">
                        Wrong file type detected. Only .json is supported.
                    </Typography>
                </Case>
                <Case condition={isDragActive || isDragAccept}>
                    <Typography color="textSecondary" component="p">
                        Drop scripting.json here
                    </Typography>
                </Case>
                <Default>
                    <Typography color="textSecondary" component="p">
                        Drop scripting.json here or click here to browse for it
                    </Typography>
                </Default>
            </Switch>
        </div>
    );
};

export default ScriptingDocDropZone;
