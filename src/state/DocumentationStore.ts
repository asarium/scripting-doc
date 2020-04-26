import {asyncComputed} from "computed-async-mobx";
import {DocumentationElement, ScriptingDocumentation, ValidationError} from "fso-ts-generator";
import {action, autorun, computed, observable} from "mobx";
import {IProgressState} from "../util/progress";
import {FilteredDocumentationElement} from "../worker/SearchWorker";
import {DocumentationIndex} from "./DocumentationIndex";
import {IndexStore} from "./IndexStore";

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

export class DocumentationStore {
    @observable public documentation?: ScriptingDocumentation;
    @observable public errorText?: string;
    @observable public loadingDocumentation: boolean = true;
    @observable public currentLoadingState?: IProgressState;
    private _indexStore: IndexStore;
    private _docIndex: DocumentationIndex;
    public filteredElements = asyncComputed(null as FilteredDocumentationElement[] | null, 500, async () => {
        if (!this._indexStore.searchTerm || !this.hasDocumentation) {
            return null;
        }

        const searchWorker = await this._docIndex.getSearchWorker();

        return searchWorker.search(this.documentation!, this._indexStore.searchTerm!);
    }, "filteredElements");
    private _elementDataLookup: Map<string, ElementMetaData> = new Map<string, ElementMetaData>();

    constructor(indexStore: IndexStore, docIndex: DocumentationIndex) {
        this._indexStore = indexStore;
        this._docIndex = docIndex;

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

    @action
    public setLoadingState(state: IProgressState) {
        this.currentLoadingState = state;
    }

    @action
    public setDocumentationData(docString: string) {
        try {
            const docData = JSON.parse(docString);
            this.documentation = ScriptingDocumentation.parseAndValidate(docData);
        } catch (err) {
            if (err instanceof ValidationError) {
                this.errorText = err.validationErrors.toString();
            } else {
                this.errorText = err.toString();
            }
        } finally {
            this.loadingDocumentation = false;
        }
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
