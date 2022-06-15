import { promisify } from "util";
import { promises as asyncfs } from "fs";
import { SlsSdk } from "sls-sdk";
import { InMemoryFileInfoRepo } from "sls-sdk/src/fileInfoRepo/InMemoryFileInfoRepo";
import { InMemoryClientRepo } from "sls-sdk/src/clientRepo/InMemoryClientRepo";
import { FirstFitFreeSpaceFinder } from "sls-sdk/src/freeSpaceFinder/FirstFitFreeSpaceFinder";

const STORAGE_ROOT = './clients-storages'

export class Utils {
    public static get BROKER_URL(): string {
        return process.env.BROKER_URL
    }

    public static async waitForSdkToWarmUp() {
        await promisify(setTimeout)(4)
    }

    public static getStorageRootPath(clientId: string): string {
        return `${STORAGE_ROOT}/root-of-${clientId}`
    }

    public static async clearStorage() {
        await asyncfs.rm(STORAGE_ROOT, { recursive: true, force: true })
    }

    public static newSDK() {
        const clientId = Math.random().toString()
        return new SlsSdk(Utils.BROKER_URL,
            clientId,
            Utils.getStorageRootPath(clientId),
            "info",
            new InMemoryFileInfoRepo(),
            new InMemoryClientRepo(),
            new FirstFitFreeSpaceFinder())
    }

    public static async prepareFreshEnvironment(): Promise<SlsSdk> {
        const sdk = Utils.newSDK()
        await Utils.clearStorage()
        await sdk.start()
        await Utils.waitForSdkToWarmUp()
        return sdk
    }
}
