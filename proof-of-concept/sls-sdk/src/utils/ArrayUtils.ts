export class ArrayUtils {
    public static remove<T>(arr: T[], element: T): boolean {
        const index = arr.indexOf(element)
        if (index < 0)
            return false
        arr.splice(index, 1)
        return true
    }
    public static find<T>(arr: T[], match: (element: T) => boolean): T {
        for (const item of arr)
            if (match(item))
                return item
        return null
    }
}
