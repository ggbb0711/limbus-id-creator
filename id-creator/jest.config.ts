import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({dir: './'})

const aliases = ['api','assets','components','config','features','hooks','stores','styles','types','utils']

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: Object.fromEntries(
    aliases.map(a => [`^${a}/(.*)$`, `<rootDir>/src/${a}/$1`])
  ),
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/StatusEffectScrapping/'],
  modulePathIgnorePatterns: ['<rootDir>/StatusEffectScrapping/'],
}

export default createJestConfig(config)