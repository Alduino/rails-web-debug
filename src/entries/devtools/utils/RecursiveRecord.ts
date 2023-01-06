export default interface RecursiveRecord {
    [key: string]: string | number | boolean | RecursiveRecord;
}
