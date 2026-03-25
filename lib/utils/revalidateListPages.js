/**
 * 首页、商品列表分页等依赖「全站商品目录」的页面：ISR 间隔取全站值与「列表上限」中更短者，
 * 避免新上架要等 12h/30d 才出现在列表。图片与其它页的缓存策略不变。
 *
 * Vercel 可选环境变量 LIST_REVALIDATE_SECOND（秒），默认 900（15 分钟）。
 */
export function revalidateSecondsForProductList(globalSeconds) {
  const g = Number(globalSeconds)
  const raw = process.env.LIST_REVALIDATE_SECOND
  const cap =
    raw != null && String(raw).trim() !== ''
      ? Number(raw)
      : 900
  if (!Number.isFinite(g) || g < 30) return 30
  if (!Number.isFinite(cap) || cap < 30) return Math.min(g, 900)
  return Math.min(g, cap)
}
