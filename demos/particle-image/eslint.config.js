// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  // 全局忽略
  {
    ignores: ['dist', 'node_modules'],
  },
  // 基础推荐规则（JS + TS）
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // TS/TSX 文件：React Hooks + React Refresh
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // R3F GPGPU 模式必须在渲染循环中修改 hook 返回的 uniform 对象
      'react-hooks/immutability': 'off',
      // R3F useGPGPU 在 useMemo 初始化时需设置 ref.current
      'react-hooks/refs': 'off',
      // HUD 采样步长同步需在 effect 中 setState（有意义的同步场景）
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // 类型检查降级规则（避免与现有合理代码冲突）
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Prettier 兼容（关闭与 Prettier 冲突的规则）
  eslintConfigPrettier,
)
