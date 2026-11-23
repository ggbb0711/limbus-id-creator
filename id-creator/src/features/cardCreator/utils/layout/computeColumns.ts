export interface ColumnLayoutOptions {
    gap?: number
    columnWidth?: number
    tolerance?: number
}

export interface ColumnLayout {
    columns: number
    width: number
}

export function computeColumns(heights: readonly number[], containerHeight: number, { gap = 25, columnWidth = 500, tolerance = 5 }: ColumnLayoutOptions = {}): ColumnLayout {
    let columns = 1
    let columnHeight = 0
    for (const height of heights) {
        if (columnHeight > 0 && columnHeight + height > containerHeight - tolerance) {
            columns++
            columnHeight = 0
        }
        columnHeight += height + gap
    }
    return { columns, width: columns * columnWidth + (columns - 1) * gap }
}
