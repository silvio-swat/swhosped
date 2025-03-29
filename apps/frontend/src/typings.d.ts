interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
}