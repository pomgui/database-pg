import { PiPgDatabase } from '../src/pg/pi-pg-database';
import { escapeCases } from './PiPgDatabase.testcases';

describe(`PiPgDatabase`, () => {
    let db: PiPgDatabase;

    describe(`Normal life cycle`, () => {
        const dbMockedClient = () => ({
            query: jest.fn(),
            end: jest.fn(),
            release: jest.fn()
        });

        describe(`plain connection`, () => {
            let dbclient: any;
            beforeEach(() => db = new PiPgDatabase((dbclient = dbMockedClient()) as any));
            test(`End connection`, async () => {
                await db.close();
                expect(dbclient.end).toBeCalled();
            });
            test(`begin transaction`, async () => {
                await db.beginTransaction();
                expect(dbclient.query).toBeCalledWith('BEGIN');
            });
            test(`Commit transaction`, async () => {
                await db.commit();
                expect(dbclient.query).toBeCalledWith('COMMIT');
            });
            test(`Rollback transaction`, async () => {
                await db.rollback();
                expect(dbclient.query).toBeCalledWith('ROLLBACK');
            });
            test(`Normal Query (select)`, async () => {
                dbclient.query.mockResolvedValue({ rows: [], rowCount: 1, insertId: 0, changedRows: 0 });
                await db.query(`select :a, :b, :c`, { a: 'sdata', b: 2, c: 'more data' });
                expect(dbclient.query).toBeCalledWith('select $1, $2, $3', ['sdata', 2, 'more data']);
            });
            test(`Normal Query (call)`, async () => {
                const r = { rows: [], rowCount: 1, insertId: 0, affectedRows: 0 };
                dbclient.query.mockResolvedValue([r, r]);
                await db.query(`call :a, :b, :c`, { a: 'sdata', b: 2, c: 'more data' });
                expect(dbclient.query).toBeCalledWith('call $1, $2, $3', ['sdata', 2, 'more data']);
            });
        });

        describe(`Pool connection`, () => {
            let dbclient: any;
            beforeEach(() => {
                dbclient = dbMockedClient();
                dbclient._ID = 1;
                db = new PiPgDatabase(dbclient as any);
            });
            test(`Release connection`, async () => {
                await db.close();
                expect(dbclient.release).toBeCalled();
            });
        });
    });

    describe(`escape()`, () => {
        beforeEach(() => { db = new PiPgDatabase({} as any); });

        test.each(escapeCases)(`$title`, (_case) => {
            if (_case.error) expect.assertions(1);
            try {
                const escaped = db.escape(_case.value);
                expect(escaped).toBe(_case.expected);
            } catch (e: any) {
                expect(e.message).toBe(_case.error);
            }
        });
    });
});