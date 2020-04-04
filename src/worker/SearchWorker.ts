import {DocumentationElement} from "fso-ts-generator";
import {registerSerializer, spawn, Worker} from "threads";
import {PromiseValue} from "type-fest";
import {ScriptingDocumentationSerializer} from "./ScriptingDocumentationSerializer";
import {SearchApi} from "./search_thread";

export type MatchRange = [number, number];

export interface FilteredDocumentationElement {
    element: DocumentationElement;
    matches: MatchRange[];
}

export type SearchWorker = PromiseValue<ReturnType<typeof createSearchWorker>>;

registerSerializer(new ScriptingDocumentationSerializer());

export async function createSearchWorker() {
    return spawn<SearchApi>(new Worker("./search_thread.ts"));
}
