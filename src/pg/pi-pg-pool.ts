import { PiDatabasePool } from "@pomgui/database";
import { Pool, PoolConfig } from "pg";
import { PiPgDatabase } from "./pi-pg-database";


export class PiPgPool implements PiDatabasePool {
    private _pool: Pool;
    private _ID = 0;

    /**
     * @param _options
     * @param size Pool size
     */
    constructor(private _options: PoolConfig, size = 10) {
        this._options = Object.assign({ max: size }, _options);
        this._pool = new Pool(this._options);
    }

    async get(): Promise<PiPgDatabase> {
        let db = await this._pool.connect();
        if (!(db as any)._ID)
            (db as any)._ID = ++this._ID;
        return new PiPgDatabase(db);
    }

    close(): Promise<void> {
        return this._pool.end();
    }
}