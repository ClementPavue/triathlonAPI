export const MimeMap = Object.freeze({
    pdf: "application/pdf",
    csv: "text/csv",
    zip: "application/gzip",
    csv_gz: "application/gzip",
    xls: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const);

export type FileExt = keyof typeof MimeMap;
export type MIME = (typeof MimeMap)[FileExt];
