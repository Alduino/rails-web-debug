type Classes = string | ReadonlyArray<Classes> | Record<string, boolean>;

function add(source: Classes, set: Set<string>) {
    if (typeof source === "string") {
        set.add(source);
    } else if (Array.isArray(source)) {
        for (const item of source) {
            add(item, set);
        }
    } else {
        for (const [key, value] of Object.entries(source)) {
            if (!value) continue;
            set.add(key);
        }
    }
}

export default function cx(...classes: ReadonlyArray<Classes>): string {
    const set = new Set<string>();
    add(classes, set);
    return Array.from(set).join(" ");
}
