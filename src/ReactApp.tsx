import {Container, createStyles, CssBaseline} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ThemeProvider} from "@material-ui/styles";
import {observer} from "mobx-react-lite";
import * as React from "react";
import {Route, Switch} from "react-router-dom";
import DocumentationRootView from "./components/doc/DocumentationRootView";
import Header from "./components/Header";
import IndexView from "./components/IndexView";

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
        width:     "100%",
        flexGrow:  1,
        overflowY: "auto",
    },
}));

const ReactApp: React.FC = observer(() => {
    const styles = useStyles();

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Header/>
            <Container maxWidth="xl" className={styles.mainContainer}>
                <Switch>
                    <Route path="/doc/:id">
                        <DocumentationRootView/>
                    </Route>
                    <Route path="*">
                        <IndexView/>
                    </Route>
                </Switch>
            </Container>
        </ThemeProvider>
    );
});

export default ReactApp;
