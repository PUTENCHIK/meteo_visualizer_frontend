import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    { ignores: ['dist', 'node_modules'] },

    // base configs
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // project configs
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
            parser: tseslint.parser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'prettier': prettierPlugin,
        },
        rules: {
            // base rules
            ...reactHooks.configs.recommended.rules,

            // отсутствие точек с запятой - ошибка
            'semi': ['error', 'always'],
            // кавычки всегда одиночные
            'quotes': ['error', 'single', { avoidEscape: true }],

            // ошибки prettier считаются как ошибки eslint, а также не заменяет переносы строк
            'prettier/prettier': ['error', { endOfLine: 'lf' }],

            // предупреждение об any в коде
            '@typescript-eslint/no-explicit-any': 'warn',
            // ошибка при неиспользуемых переменных (за исключением _)
            '@typescript-eslint/no-unused-vars': ['error', {
                varsIgnorePattern: "_",
                argsIgnorePattern: '_',
            }],
            // предупреждение при console.log
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            // ошибка, если непереназначаемая переменная объявлена не const
            'prefer-const': 'error',

            // предупреждение при экспорте функций или неконстант, чтобы страница не перезагружалась
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    // disable conflicts with prettier
    prettierConfig,
];
