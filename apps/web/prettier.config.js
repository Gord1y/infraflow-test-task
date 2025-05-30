module.exports = {
  semi: false,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/layout/(.*)$',
    '^@/ui/(.*)$',
    '^@/providers/(.*)$',
    '^@/shared/(.*)$',
    '^@/assets/(.*)$',
    '^@/config/(.*)$',
    '^@/store/(.*)$',
    '^@/hooks/(.*)$',
    '^@/types/(.*)$',
    '^@/utils/(.*)$',
    '^@/api/(.*)$',
    '^../(.*)$',
    '^./(.*)$'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ]
}
