import { Box, CircularProgress, Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import { observer } from "mobx-react-lite";
import React from "react";
import { When } from "react-if";
import { useRouteMatch } from "react-router-dom";
import { useStores } from "../state/useStores";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            display: "none",
            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        versionNumber: {
            marginLeft: "auto",
            display: "none",
            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(3),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        searchProgressIndicator: {
            position: "absolute",
            pointerEvents: "none",
            top: 2,
            left: 13,
            zIndex: 1,
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    }),
);


const Header: React.FC = observer(() => {
    const { indexStore, documentationIndex } = useStores();

    let docState;

    // Check if the current document is currently being searched in
    const match = useRouteMatch<{ id: string }>("/doc/:id");
    if (match !== null) {
        const { id } = match.params;

        docState = documentationIndex.docs.get(id);
    }

    const classes = useStyles();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        indexStore.updateSearch(event.target.value);
    };

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography className={classes.title} variant="h6" noWrap>
                    FreeSpace Open Scripting Documentation
                        </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                        <When condition={!!docState && docState.filteredElements.busy}>
                            <CircularProgress className={classes.searchProgressIndicator} size={30} color="primary" />
                        </When>
                    </div>
                    <InputBase
                        placeholder="Search..."
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ "aria-label": "search" }}
                        onChange={onChange}
                        value={indexStore.searchTerm}
                    />
                </div>
                <Typography className={classes.versionNumber} variant="h6" noWrap>
                    {__VERSION__}
                </Typography>
            </Toolbar>
        </AppBar>
    );
});

export default Header;
