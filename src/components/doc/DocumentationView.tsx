import {ClassElement, LibraryElement} from "fso-ts-generator";
import {observer} from "mobx-react";
import * as React from "react";
import {documentationStore} from "../../state/DocumentationStore";
import DocElementList from "./DocElementList";
import EnumsView from "./EnumsView";
import FilteredDocElementList from "./FilteredDocElementList";
import StringListView from "./StringListView";

@observer
export class DocumentationView extends React.Component<{}> {
    render() {
        const doc = documentationStore.documentation!;

        let elementList;
        const filteredElements = documentationStore.filteredElements.get();
        if (filteredElements === null) {
            elementList = (
                <>
                    <DocElementList elements={doc.elements.filter(x => x.type === "library")} topLevel={true}/>
                    <DocElementList elements={doc.elements.filter(x => x.type === "class")} topLevel={true}/>
                </>
            );
        } else {
            elementList = <FilteredDocElementList elements={filteredElements}/>;
        }

        return (
            <>
                {elementList}
                <StringListView title={"Actions"} strings={doc.actions}/>
                <StringListView title={"Conditions"} strings={doc.conditions}/>
                <EnumsView enums={doc.enums}/>
            </>
        );
    }
}

export default DocumentationView;
