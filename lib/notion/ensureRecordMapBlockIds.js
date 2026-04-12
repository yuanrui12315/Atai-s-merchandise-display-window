/**
 * react-notion-x 渲染时用 notion-utils 的 uuidToId(block.id)；
 * id 为 undefined 会在构建期 SSR 报 Cannot read properties of undefined (reading 'replace')。
 * 同步块展开等处理后可能出现 value 与 map key 脱节、缺 id，此处用 key 补齐并规范为字符串。
 */
export function ensureRecordMapBlockIds(recordMap) {
  const block = recordMap?.block
  if (!block || typeof block !== 'object') return recordMap

  for (const blockKey of Object.keys(block)) {
    const entry = block[blockKey]
    const v = entry?.value
    if (!v || typeof v !== 'object') continue

    if (v.id == null || v.id === '') {
      v.id = blockKey
    } else if (typeof v.id !== 'string') {
      v.id = String(v.id)
    }
  }
  return recordMap
}
