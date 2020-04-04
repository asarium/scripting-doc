import {asyncComputed} from "computed-async-mobx";
import {DocumentationElement, ScriptingDocumentation, ValidationError} from "fso-ts-generator";
import {action, autorun, computed, observable} from "mobx";
import {createSearchWorker, FilteredDocumentationElement, SearchWorker} from "../worker/SearchWorker";
import {indexStore} from "./IndexStore";

interface ElementMetaData {
    parentPath: DocumentationElement[];
}

function* enumerateDocumentationElements(
    els: DocumentationElement[],
    parentPath: DocumentationElement[] = []): IterableIterator<{
    element: DocumentationElement;
    parentPath: DocumentationElement[];
}> {
    for (const el of els) {
        yield {
            element:    el,
            parentPath: Array.from(parentPath),
        };

        parentPath.push(el);
        yield* enumerateDocumentationElements(el.children, parentPath);
        parentPath.pop();
    }
}

export interface DocumentationLoadOperations {
    startLoading(): void;

    setIndeterminateProgress(description?: string): void;

    setProgress(progress: number, description?: string): void;

    finishedLoading(docData: unknown): void;
}

export class DocumentationStore {
    @observable documentation?: ScriptingDocumentation;
    @observable errorText?: string;

    @observable loadingDocumentation: boolean = false;
    @observable loadingDescription: string = "";
    @observable loadingProgress: number = -1.0;

    _searchWorker?: SearchWorker;

    _elementDataLookup: Map<string, ElementMetaData> = new Map<string, ElementMetaData>();

    filteredElements = asyncComputed(null as FilteredDocumentationElement[] | null, 500, async () => {
        if (!indexStore.searchTerm || !this.hasDocumentation) {
            return null;
        }

        if (!this._searchWorker) {
            this._searchWorker = await createSearchWorker();
        }

        return this._searchWorker.search(this.documentation!, indexStore.searchTerm!);
    }, "filteredElements");

    constructor() {
        autorun(() => {
            this._elementDataLookup.clear();
            if (!this.documentation) {
                return;
            }

            this.populateElementMetadata();
        });
    }

    @computed get hasDocumentation() {
        return !!this.documentation;
    }

    @computed get inError() {
        return !!this.errorText;
    }

    getDocumentationLoadOperation(): DocumentationLoadOperations {
        return {
            setProgress:              action((progress: number, description?: string) => {
                this.loadingProgress = progress;
                this.loadingDescription = description ?? "";
            }),
            setIndeterminateProgress: action((description?: string) => {
                this.loadingProgress = -1.0;
                this.loadingDescription = description ?? "";
            }),
            startLoading:             action(() => {
                this.loadingDocumentation = true;
                this.loadingProgress = -1.0;
            }),
            finishedLoading:          (docData: unknown) => {
                this.setDocumentationData(docData);
            },
        };
    }

    getElementAnchor(element: DocumentationElement) {
        const elData = this._elementDataLookup.get(element.id);

        if (!elData) {
            throw new Error("Element was not found in data lookup!");
        }

        return "docElement-" + elData.parentPath.concat(element).map(el => el.name).join("-");
    }

    getElementParentPath(element: DocumentationElement): DocumentationElement[] {
        const elData = this._elementDataLookup.get(element.id);

        if (!elData) {
            throw new Error("Element was not found in data lookup!");
        }

        return elData.parentPath;
    }

    getClassElement(name: string): DocumentationElement | undefined {
        return this.documentation?.elements.find(el => el.type === "class" && el.name === name);
    }

    getClassElementOrFail(name: string): DocumentationElement {
        const classEl = this.documentation?.elements.find(el => el.type === "class" && el.name === name);

        if (!classEl) {
            throw Error("Invalid class name '" + classEl + "'.");
        }

        return classEl;
    }

    @action
    private setDocumentationData(docData: unknown) {
        try {
            this.documentation = ScriptingDocumentation.parseAndValidate(docData);
        } catch (err) {
            if (err instanceof ValidationError) {
                console.log(err.validationErrors);
            } else {
                console.log(err);
            }
        } finally {
            this.loadingDocumentation = false;
        }
    }

    private populateElementMetadata() {
        if (!this.documentation) {
            return;
        }

        for (const elData of enumerateDocumentationElements(this.documentation.elements)) {
            this._elementDataLookup.set(elData.element.id, {
                parentPath: elData.parentPath,
            });
        }
    }
}

export const documentationStore = new DocumentationStore();

