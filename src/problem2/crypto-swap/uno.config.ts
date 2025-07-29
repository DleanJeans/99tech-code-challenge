import { defineConfig, presetWind4, presetAttributify, presetTypography } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetScrollbar(),
  ],
  theme: {
    boxShadow: {
      'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      'medium': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    animation: {
      'spin-slow': 'spin 3s linear infinite',
      'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'bounce-soft': 'bounce 1s infinite',
    }
  },
  shortcuts: {
    'btn-primary': 'bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-medium active:transform active:scale-98',
    'btn-secondary': 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-300',
    'input-field': 'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-all duration-200',
    'card': 'bg-gray-800 rounded-xl shadow-soft p-6',
    'gradient-bg': 'bg-gradient-to-br from-primary-500 to-primary-700',
  },
  rules: [
    // Custom transform scale rule
    [/^scale-(\d+)$/, ([, d]) => ({ transform: `scale(0.${d})` })],
    // Custom backdrop blur
    [/^backdrop-blur-(\w+)$/, ([, value]) => ({ 'backdrop-filter': `blur(${value === 'sm' ? '4px' : value === 'md' ? '12px' : '20px'})` })],
  ]
})
