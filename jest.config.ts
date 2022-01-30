import { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const moduleNameMapper = {
  ...pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/' + compilerOptions.baseUrl + '/',
  }),
} as Config.InitialOptions['moduleNameMapper'];

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  moduleNameMapper,
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageReporters: ['json'],
  testLocationInResults: true,
};

export default config;
