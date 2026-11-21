import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({dir: './'})

const aliases = ['api','assets','components','config','features','hooks','stores','styles','types','utils']

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    ...Object.fromEntries(aliases.map(a => [`^${a}/(.*)$`, `<rootDir>/src/${a}/$1`])),
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/StatusEffectScrapping/'],
  modulePathIgnorePatterns: ['<rootDir>/StatusEffectScrapping/'],
}

const ESM_PACKAGES = ['github-slugger']

const jestConfig = async (): Promise<Config> => {
  const base = await createJestConfig(config)()
  return {
    ...base,
    transformIgnorePatterns: (base.transformIgnorePatterns ?? []).map(pattern =>
      pattern.replace('(geist|', `(${ESM_PACKAGES.join('|')}|geist|`)),
  }
}

export default jestConfig
