import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0 && collectionId && collectionQuery?.[collectionId]) {
      const ids =
        collectionQuery[collectionId][viewIds[groupIndex]]?.collection_group_results
          ?.blockIds || []
      if (ids.length) {
        for (const id of ids) {
          pageIds.push(id)
        }
      }
    }
  } catch (error) {
    // 勿在 catch 中引用 try/if 内才声明的变量（曾误写 ids → ReferenceError 拖垮全站 getGlobalData）
    console.error('Error fetching page IDs:', error)
    return []
  }

  // 否则按照数据库原始排序
  const queryForCollection = collectionId && collectionQuery?.[collectionId]
  if (
    pageIds.length === 0 &&
    queryForCollection &&
    Object.keys(queryForCollection).length > 0
  ) {
    const pageSet = new Set()
    Object.values(queryForCollection).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }
  return pageIds
}
