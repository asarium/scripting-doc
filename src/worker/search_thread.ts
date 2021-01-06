import {DocumentationElement, ScriptingDocumentation} from "fso-ts-generator";
import Fuse from "fuse.js";
import {expose, registerSerializer} from "threads";
import {ScriptingDocumentationSerializer} from "./ScriptingDocumentationSerializer";
import {FilteredDocumentationElement} from "./SearchWorker";

registerSerializer(new ScriptingDocumentationSerializer());

function* enumerateAllDocElements(elements: DocumentationElement[]): IterableIterator<DocumentationElement> {
    for (const el of elements) {
        yield el;

        yield* enumerateAllDocElements(el.children);
    }
}

function convertMatchToFilterElement(match: Fuse.FuseResult<DocumentationElement>): FilteredDocumentationElement {
    return {
        element: match.item,
        matches: Array.from(match.matches!.find(x => x.key === "name")!.indices),
    };
}

const api = {
    search(doc: ScriptingDocumentation, searchTerm: string): FilteredDocumentationElement[] {
        const allElements = Array.from(enumerateAllDocElements(doc.elements));

        const fuse = new Fuse(allElements, {
            keys:           ["name"],
            includeMatches: true,
            caseSensitive:  false,
        });

        const matches = fuse.search(searchTerm);

        // Limit to 30 elements since everything else is probably not useful anyway
        if (matches.length > 30) {
            matches.length = 30;
        }

        return matches.map(match => convertMatchToFilterElement(match));
    },
};

export type SearchApi = typeof api;

expose(api);
