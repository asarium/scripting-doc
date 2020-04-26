import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import {createStyles, fade, makeStyles, Theme} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import {observer} from "mobx-react-lite";
import React from "react";
import {useStores} from "../state/useStores";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title:      {
            display:                      "none",
            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        search:     {
            position:                     "relative",
            borderRadius:                 theme.shape.borderRadius,
            backgroundColor:              fade(theme.palette.common.white, 0.15),
            "&:hover":                    {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight:                  theme.spacing(2),
            marginLeft:                   0,
            width:                        "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(3),
                width:      "auto",
            },
        },
        searchIcon: {
            padding:        theme.spacing(0, 2),
            height:         "100%",
            position:       "absolute",
            pointerEvents:  "none",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
        },
        inputRoot:  {
            color: "inherit",
        },
        inputInput: {
            padding:                      theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft:                  `calc(1em + ${theme.spacing(4)}px)`,
            transition:                   theme.transitions.create("width"),
            width:                        "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    }),
);


const Header: React.FC = observer(() => {
    const {indexStore} = useStores();

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
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Search..."
                        classes={{
                            root:  classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{"aria-label": "search"}}
                        onChange={onChange}
                        value={indexStore.searchTerm}
                    />
                </div>
            </Toolbar>
        </AppBar>
    );
});

export default Header;
