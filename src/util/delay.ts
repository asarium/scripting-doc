export async function delay(timeoutMs: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, timeoutMs);
    });
}
