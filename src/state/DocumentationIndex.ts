import {action, observable} from "mobx";
import {ProgressTracker} from "../util/progress";
import {createSearchWorker, SearchWorker} from "../worker/SearchWorker";
import {DocumentationStore} from "./DocumentationStore";
import {IndexStore} from "./IndexStore";

const LOCAL_DOC_ID = "local";

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

        const lastDoc = localStorage.getItem("lastDocumentation");

        if (lastDoc !== null) {
            const doc = new DocumentationStore(this._indexStore, this);
            doc.setDocumentationData(lastDoc);

            this.docs.set(LOCAL_DOC_ID, doc);

            this._indexStore.navigateTo("/doc/" + LOCAL_DOC_ID);
        }
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

                if (docId == LOCAL_DOC_ID) {
                    // Cache the local doc data in the storage for faster usage of the common case
                    localStorage.setItem("lastDocumentation", docString);
                }

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
