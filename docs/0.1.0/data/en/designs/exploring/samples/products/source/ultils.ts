import { FormatUtils } from '@ijstech/components'

export function formatNumber(value: number | string) {
  return FormatUtils.formatNumber(value, { shortScale: true })
}