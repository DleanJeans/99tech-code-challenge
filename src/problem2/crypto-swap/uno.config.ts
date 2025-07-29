import { defineConfig, presetWind4, presetAttributify, presetTypography } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetScrollbar(),
  ]
})
