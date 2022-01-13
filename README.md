# PosgreSQL Database library

[![Package Version][package-image]][package-url]
[![Open Issues][issues-image]][issues-url]

@pomgui/database-pg is a typescript library that provides an interface to execute the normal operations
with a client [pg](https://www.npmjs.com/package/pg) 
database driver as connect, start transaction, commit, etc.

## Advantages:

- All methods return promises.
- It uses query parameters like `:id` instead of `?`.
- The parameters understand object's hierarchy, so it understands parameters like `:entry.id`.
- The returned rows also are preprocessed to return nested objects if needed (See Usage Example section).
- It maintains the same interface ([@pomgui/database][base-url]) no matter the database, so it helps with the migration from different databases E.g. MySQL to Firebird or to PostgreSQL and vice versa
  (See [@pomgui/database-mysql][database-mysql-url] usage example and compare)

## Installation

Use npm to install the library.

```bash
npm install @pomgui/database-pg --save
```

## Usage Example

```typescript
import { PiPgPool } from '@pomgui/database-pg';

const options = {
    connectionString: 'user:pass@host:5432/database'
};

async work(){
    const pool = new PiPgPool(options, 10);
    const db = await pool.get();
    await db.beginTransaction();
    try{
        const param = {entry: {id: 3}};
        const data = await db.query(`
            SELECT 
                e.entry_id "id", e.entry_date, 
                b.benef_id "benef.id", b.name "benef.name"
            FROM ENTRIES e JOIN BENEFICIARIES db ON b.benef_id = e.benef_id
            WHERE entry_id >= :entry.id
            LIMIT 10`, param);
        console.log(data);
        await db.commit();
    }catch(err){
        console.error(err);
        await db.rollback();
    }finally{
        await db.close();
    }
}
```

This will print:

```javascript
[{  id: 3, 
    entryDate: 2020-08-01T00:00:00.000Z,
    benef: {
        id: 1,
        name: 'John Doe'
    }
},{  id: 4, 
    date: 2020-08-02T00:00:00.000Z,
    benef: {
        id: 1,
        name: 'Jane Doe'
    }
}, ...
]
```




[base-url]: https://www.npmjs.com/package/@pomgui/database
[project-url]: https://github.com/pomgui/database-pg
[database-mysql-url]: https://www.npmjs.com/package/@pomgui/database-mysql
[package-image]: https://badge.fury.io/js/@pomgui%2Fdatabase-pg.svg
[package-url]: https://www.npmjs.com/package/@pomgui/database-pg
[issues-image]: https://img.shields.io/github/issues/pomgui/database-pg.svg?style=popout
[issues-url]: https://github.com/pomgui/database-pg/issues
