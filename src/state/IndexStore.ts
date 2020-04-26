import {History} from "history";
import {action, observable} from "mobx";

export class IndexStore {
    @observable searchTerm: string = "";

    private _history: History;

    constructor(history: History) {
        this._history = history;
    }

    @action updateSearch(newSearch: string) {
        this.searchTerm = newSearch;
    }

    public navigateTo(path: string) {
        this._history.push(path);
    }
}
