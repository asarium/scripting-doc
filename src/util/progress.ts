export interface IProgressState {
    readonly description: string;
    readonly hasDescription: boolean;

    readonly progress: number;
    readonly indeterminate: boolean;
}

type ProgressListener = (state: IProgressState) => void;

class ProgressStateImpl implements IProgressState {
    description: string;
    progress: number;

    constructor(description: string, progress: number) {
        this.description = description;
        this.progress = progress;
    }

    get hasDescription() {
        return this.description.length > 0;
    }

    get indeterminate() {
        return this.progress < 0;
    }
}

type ProgressRange = { begin: number; end: number; };

export class ProgressTracker {
    private _listeners: ProgressListener[] = [];
    private _currentState: ProgressStateImpl = new ProgressStateImpl("", -1.0);

    private _progressRange?: ProgressRange;
    private _currentProgress: number = -1.0;

    public registerForChanges(listener: ProgressListener): () => void {
        this._listeners.push(listener);
        listener(this._currentState);

        return () => {
            const index = this._listeners.indexOf(listener);
            if (index >= 0) {
                this._listeners.splice(index, 1);
            }
        };
    }

    public beginTask(description: string, range?: ProgressRange): void {
        this._currentState.description = description;
        this._currentState.progress = range ? 0.0 : -1.0;

        this._progressRange = range;

        this.sendProgressUpdates();
    }

    public updateProgress(progress: number) {
        this._currentProgress = progress;

        this.sendProgressUpdates();
    }

    private sendProgressUpdates() {
        if (!this._progressRange) {
            this._currentState.progress = -1.0;
        } else {
            this._currentState.progress =
                (this._currentProgress - this._progressRange.begin) /
                (this._progressRange.end - this._progressRange.begin);
        }

        this.invokeListeners();
    }

    private invokeListeners() {
        // Copy to not allow listeners to update local state
        const copy = new ProgressStateImpl(this._currentState.description, this._currentState.progress);

        this._listeners.forEach(x => x(copy));
    }
}
