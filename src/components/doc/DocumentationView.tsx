import {Typography} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import * as React from "react";
import {useDocStore} from "../../state/useStores";
import LoadingIndicator from "../LoadingIndicator";
import DocElementList from "./DocElementList";
import EnumsView from "./EnumsView";
import FilteredDocElementList from "./FilteredDocElementList";
import StringListView from "./StringListView";

const DocumentationView: React.FC = observer(() => {
    const documentationStore = useDocStore();

    if (documentationStore.errorText) {
        return (<Typography>
            {documentationStore.errorText}
        </Typography>);
    }

    if (documentationStore.loadingDocumentation) {
        return <LoadingIndicator/>;
    }

    const doc = documentationStore.documentation!;

    let elementList;
    const filteredElements = documentationStore.filteredElements.get();
    if (filteredElements === null) {
        elementList = (
            <>
                <DocElementList elements={doc.elements.filter(x => x.type === "library")}/>
                <DocElementList elements={doc.elements.filter(x => x.type === "class")}/>
            </>
        );
    } else {
        elementList = <FilteredDocElementList elements={filteredElements}/>;
    }

    return (
        <>
            {elementList}
            <StringListView title={"Actions"} strings={doc.actions.map(x => x.name)}/>
            <StringListView title={"Conditions"} strings={doc.conditions}/>
            <EnumsView enums={doc.enums}/>
        </>
    );
});

export default DocumentationView;
