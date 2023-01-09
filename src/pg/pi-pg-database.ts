import { PiDatabase, QueryResult } from '@pomgui/database';
import { Client, ClientBase, PoolClient } from 'pg';
import { Logger } from 'sitka';

export class PiPgDatabase extends PiDatabase {
    constructor(private _db: ClientBase) {
        super();
        this._paramChar = '$';
        this._logger = Logger.getLogger('Pg#' + ((_db as any)._ID || 0));
    }

    escape(value: any): string {
        if (value === null || value === undefined)
            return 'NULL';

        switch (typeof (value)) {
            case 'boolean':
                return value ? 'TRUE' : 'FALSE';
            case 'number':
                return value.toString();
            case 'string':
                return '\'' + value.replace(/'/g, `''`).replace(/\\/g, '\\\\') + '\'';
        }

        if (value instanceof Date) {
            const pad = (n: number, d: number) => ('000' + n.toString()).substr(-d);
            return `TIMESTAMP '`
                + value.getFullYear()
                + '-' + pad(value.getMonth() + 1, 2)
                + '-' + pad(value.getDate(), 2)
                + ' ' + pad(value.getHours(), 2)
                + ':' + pad(value.getMinutes(), 2)
                + ':' + pad(value.getSeconds(), 2)
                + '.' + pad(value.getMilliseconds(), 3) + '\'';
        }

        // If it reaches this point, treat it as a JSON object
        return '\'' + JSON.stringify(value).replace(/'/g, `''`).replace(/\\/g, '\\\\') + '\'';
    }

    async close(): Promise<void> {
        if (typeof (this._db as any)._ID != 'number')
            // It's a non pooled connection
            return (this._db as Client).end();
        else
            // It's a pooled connection
            return (this._db as PoolClient).release();
    }

    async beginTransaction(): Promise<void> {
        await this._db.query('BEGIN');
    }

    async commit(): Promise<void> {
        await this._db.query('COMMIT');
    }

    async rollback(): Promise<void> {
        await this._db.query('ROLLBACK');
    }

    protected async _executeQuery(sql: string, params: any[]): Promise<QueryResult> {
        let result: any = await this._db.query(sql, params);
        if (result[1] && 'affectedRows' in result[1])
            // work around when it's a CALL and not a SELECT
            result = result[0];
        return {
            affectedRows: result.rowCount,
            insertId: result.insertId,
            changedRows: result.changedRows,
            rows: result.rows
        };
    }
}