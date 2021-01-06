import { Fab, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { download } from "../../util/download";
import { useDocStore } from "../../state/useStores";
import LuaIcon from "../icons/LuaIcon";
import LoadingIndicator from "../LoadingIndicator";
import DocElementList from "./DocElementList";
import EnumsView from "./EnumsView";
import FilteredDocElementList from "./FilteredDocElementList";
import StringListView from "./StringListView";

const useStyles = makeStyles(theme => ({
    luaFab: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(6),
    },
}));

const DocumentationView: React.FC = observer(() => {
    const documentationStore = useDocStore();

    const classes = useStyles();

    if (documentationStore.errorText) {
        return (<Typography>
            {documentationStore.errorText}
        </Typography>);
    }

    if (documentationStore.loadingDocumentation) {
        return <LoadingIndicator />;
    }

    const doc = documentationStore.documentation!;

    let elementList;
    const filteredElements = documentationStore.filteredElements.get();
    if (filteredElements === null) {
        elementList = (
            <>
                <DocElementList elements={doc.elements.filter(x => x.type === "library")} />
                <DocElementList elements={doc.elements.filter(x => x.type === "class")} />
            </>
        );
    } else {
        elementList = <FilteredDocElementList elements={filteredElements} />;
    }

    const generateLuaDefs = () => {
        const luaDoc = doc.generateLuaDoc();

        download("fso.lua", luaDoc);
    };

    return (
        <>
            {elementList}
            <StringListView title={"Actions"} strings={doc.actions.map(x => x.name)} />
            <StringListView title={"Conditions"} strings={doc.conditions} />
            <EnumsView enums={doc.enums} />
            <Tooltip title="Generate Lua definition">
                <Fab className={classes.luaFab} color="primary" onClick={generateLuaDefs} >
                    <LuaIcon />
                </Fab>
            </Tooltip>
        </>
    );
});

export default DocumentationView;
