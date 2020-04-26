import {useLocalStore} from "mobx-react-lite";
import React from "react";
import {useHistory} from "react-router-dom";
import {DocumentationIndex} from "./DocumentationIndex";
import {DocumentationStore} from "./DocumentationStore";
import {IndexStore} from "./IndexStore";

export interface IStores {
    indexStore: IndexStore;
    documentationIndex: DocumentationIndex;
}

const storesContext = React.createContext<IStores | null>(null);

export const StoresProvider: React.FC = ({children}) => {
    const history = useHistory();
    const stores = useLocalStore(() => {
        const indexStore = new IndexStore(history);
        const documentationIndex = new DocumentationIndex(indexStore);

        return {
            indexStore,
            documentationIndex,
        };
    });
    return <storesContext.Provider value={stores}>{children}</storesContext.Provider>;
};

export const useStores = () => {
    const stores = React.useContext(storesContext);

    if (stores === null) {
        throw new Error("useStores used outside of a context!");
    }

    return stores;
};

const docStoreContext = React.createContext<DocumentationStore | null>(null);

export const DocStoreProvider: React.FC<{ docStore: DocumentationStore }> = ({docStore, children}) => {
    return <docStoreContext.Provider value={docStore}>{children}</docStoreContext.Provider>;
};

export const useDocStore = () => {
    const store = React.useContext(docStoreContext);

    if (store === null) {
        throw new Error("useDocStore used outside of a context!");
    }

    return store;
};
