import { FirstFitFreeSpaceFinder } from "./FirstFitFreeSpaceFinder";
import { IFreeSpaceFinder } from "./IFreeSpaceFinder";

export class FreeSpaceFinderFactory {
    private static i: IFreeSpaceFinder
    public static get instance() {
        if (!FreeSpaceFinderFactory.i)
            FreeSpaceFinderFactory.i = new FirstFitFreeSpaceFinder()
        return FreeSpaceFinderFactory.i
    }
}
