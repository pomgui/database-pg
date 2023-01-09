import type { Config } from '@jest/types';

process.env.TZ = 'UTC'; // All the test should run in UTC time zone

const config: Config.InitialOptions = {
    verbose: true,
    silent: true,
    transform: {
        '^.*\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json'
        }]
    },
    coveragePathIgnorePatterns: ['<rootDir>/tests/'],
    coverageReporters: [
        'html', // Generates ./coverage/index.html
        'json-summary', // Generates coverage-summary.json (used to alter the README.md)
    ],
    // Minimum coverage accepted
    coverageThreshold: {
        global: {
            statements: 100,
            lines: 100,
            functions: 100,
            branches: 100,
        }
    }
};

export default config;
