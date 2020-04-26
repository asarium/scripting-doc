import {observer} from "mobx-react-lite";
import React from "react";
import {useParams} from "react-router-dom";
import {DocStoreProvider, useStores} from "../../state/useStores";
import IndexView from "../IndexView";
import DocumentationView from "./DocumentationView";

const DocumentationRootView: React.FC = observer(() => {
    const {documentationIndex} = useStores();
    const {id} = useParams<{ id: string }>();

    const docState = documentationIndex.docs.get(id);

    if (!docState) {
        return <IndexView/>;
    }

    return (<DocStoreProvider docStore={docState}>
        <DocumentationView/>
    </DocStoreProvider>);
});

export default DocumentationRootView;
