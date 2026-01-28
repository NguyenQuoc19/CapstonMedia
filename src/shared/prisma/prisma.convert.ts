const convertData = (value: unknown): unknown => {
    if (typeof value === "bigint") return value.toString();

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(convertData);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, convertData(v)])
        );
    }

    return value;
}

export {
    convertData
}