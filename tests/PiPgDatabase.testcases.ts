export const escapeCases: {
    title: string;
    value: any;
    error?: string;
    expected?: string;
}[] = [
        {
            title: 'String With NO quotes',
            value: 'any string value',
            expected: `'any string value'`,
        },
        {
            title: 'String With quotes',
            value: `Some string's quote`,
            expected: `'Some string''s quote'`,
        },
        {
            title: 'Boolean True',
            value: true,
            expected: `TRUE`,
        },
        {
            title: 'Boolean False',
            value: false,
            expected: `FALSE`,
        },
        {
            title: 'Number',
            value: 1234,
            expected: `1234`,
        },
        {
            title: 'NaN',
            value: NaN,
            expected: `NaN`,
        },
        {
            title: 'null',
            value: null,
            expected: `NULL`,
        },
        {
            title: 'undefined',
            value: undefined,
            expected: `NULL`,
        },
        {
            title: 'Date',
            value: new Date('2023-01-09T16:20-03:00'),
            expected: `TIMESTAMP '2023-01-09 19:20:00.000'`, // UTC timezone
        },
        {
            title: 'JSON object',
            value: { property: { value: 123, str: `With a ' quote` } },
            expected: `'{"property":{"value":123,"str":"With a '' quote"}}'`
        },
        {
            title: 'Arrays are supported',
            value: [1, 2, 'abc'],
            expected: `'[1,2,"abc"]'`
        },
    ];