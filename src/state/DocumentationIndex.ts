import {action, observable} from "mobx";
import {ProgressTracker} from "../util/progress";
import {createSearchWorker, SearchWorker} from "../worker/SearchWorker";
import {DocumentationStore} from "./DocumentationStore";
import {IndexStore} from "./IndexStore";

export interface DocumentationLoadOperations {
    startLoading(): ProgressTracker;

    finishedLoading(docString: string): void;
}

export class DocumentationIndex {
    @observable docs: Map<string, DocumentationStore> = new Map<string, DocumentationStore>();

    private readonly _indexStore: IndexStore;

    private _searchWorker?: SearchWorker;

    constructor(indexStore: IndexStore) {
        this._indexStore = indexStore;
    }

    getDocumentationLoadOperation(docId: string): DocumentationLoadOperations {
        const doc = new DocumentationStore(this._indexStore, this);
        this.docs.set(docId, doc);

        let unregisterCallback: () => void;
        let progress: ProgressTracker;
        return {
            startLoading:    () => {
                progress = new ProgressTracker();
                unregisterCallback =
                    progress.registerForChanges(action(state => doc.setLoadingState(state)));

                return progress;
            },
            finishedLoading: (docString: string) => {
                doc.setDocumentationData(docString);
                this._indexStore.navigateTo("/doc/" + docId);

                if (unregisterCallback) {
                    unregisterCallback();
                }
            },
        };
    }

    async getSearchWorker() {
        if (!this._searchWorker) {
            this._searchWorker = await createSearchWorker();
        }

        return this._searchWorker;
    }
}
