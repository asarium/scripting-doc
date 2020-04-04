import {action, computed, observable} from "mobx";
import {documentationStore} from "./DocumentationStore";

export enum IndexState {
    NoData,
    Loading,
    DataAvailable,
    InError,
}

export class IndexStore {
    @observable searchTerm: string = "";

    @computed get indexState(): IndexState {
        if (documentationStore.hasDocumentation) {
            return IndexState.DataAvailable;
        }

        if (documentationStore.loadingDocumentation) {
            return IndexState.Loading;
        }

        if (documentationStore.inError) {
            return IndexState.InError;
        }

        return IndexState.NoData;
    }

    @action updateSearch(newSearch: string) {
        this.searchTerm = newSearch;
    }
}

export const indexStore = new IndexStore();
