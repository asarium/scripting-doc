import {Container, createStyles, CssBaseline} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ThemeProvider} from "@material-ui/styles";

import "fso-ts-generator";
import {configure} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import ReactDOM from "react-dom";
import {Case, Switch} from "react-if";
import "typeface-roboto";
import DocumentationView from "./components/doc/DocumentationView";
import Header from "./components/Header";
import LoadingIndicator from "./components/LoadingIndicator";
import ScriptingDocDropZone from "./components/ScriptingDocDropZone";
import "./index.scss";
import {documentationStore} from "./state/DocumentationStore";
import {IndexState, indexStore} from "./state/IndexStore";

const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
    },
});
const lightTheme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const useStyles = makeStyles(() => createStyles({
    mainContainer: {
        height: "100%",
    },
}));

const ReactApp: React.FC = observer(() => {
    const styles = useStyles();

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={styles.mainContainer}>
                <CssBaseline/>
                <Header/>
                <Container maxWidth="xl" className={styles.mainContainer}>
                    <Switch>
                        <Case condition={indexStore.indexState === IndexState.NoData}>
                            <ScriptingDocDropZone/>
                        </Case>
                        <Case condition={indexStore.indexState === IndexState.Loading}>
                            <LoadingIndicator/>
                        </Case>
                        <Case condition={indexStore.indexState === IndexState.DataAvailable}>{() => (
                            <DocumentationView/>
                        )}
                        </Case>
                        <Case condition={indexStore.indexState === IndexState.InError}>
                            <p>{documentationStore.errorText}</p>
                        </Case>
                    </Switch>
                </Container>
            </div>
        </ThemeProvider>
    );
});

configure({enforceActions: "observed"});

ReactDOM.render(
    <ReactApp/>
    , document.getElementById("react-root"));
