// ── Real Place Image Service ──
// High Resolution, Verified Place Photos for destinations worldwide.

export const WIKIMEDIA_REAL_IMAGES = {
  'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1000&h=800&q=85&auto=format&fit=crop',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&h=800&q=85&auto=format&fit=crop',
  'udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1000&h=800&q=85&auto=format&fit=crop',
  'spiti': 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=1000&h=800&q=85&auto=format&fit=crop',
  'meghalaya': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&h=800&q=85&auto=format&fit=crop',
  'andaman': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1000&h=800&q=85&auto=format&fit=crop',
  'rishikesh': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1000&h=800&q=85&auto=format&fit=crop',
  'kashmir': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1000&h=800&q=85&auto=format&fit=crop',
  'hampi': 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1000&h=800&q=85&auto=format&fit=crop',
  'jaisalmer': 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1000&h=800&q=85&auto=format&fit=crop',
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&h=800&q=85&auto=format&fit=crop',
  'gokarna': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&h=800&q=85&auto=format&fit=crop',
  'switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1000&h=800&q=85&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&h=800&q=85&auto=format&fit=crop',
  'serengeti': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&h=800&q=85&auto=format&fit=crop',
  'amalfi': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&h=800&q=85&auto=format&fit=crop',
  'patagonia': 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1000&h=800&q=85&auto=format&fit=crop',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&h=800&q=85&auto=format&fit=crop',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=800&q=85&auto=format&fit=crop',
  'greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&h=800&q=85&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&h=800&q=85&auto=format&fit=crop',
  'cappadocia': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1000&h=800&q=85&auto=format&fit=crop',
  'taj mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&h=800&q=85&auto=format&fit=crop',
}

const IMAGE_CACHE = { ...WIKIMEDIA_REAL_IMAGES }

function cleanQuery(query) {
  if (!query) return 'India'
  let q = query.split('—')[0].split('-')[0].split(',')[0].trim()
  return q.replace(/[^a-zA-Z0-9\s]/g, '').trim()
}

/**
 * Fetch authentic real photo for a location via Wikipedia REST API
 */
export async function getRealPlaceImage(query, defaultFallback = '') {
  if (!query) return defaultFallback || WIKIMEDIA_REAL_IMAGES['udaipur']

  const searchTerm = cleanQuery(query)
  const cacheKey = searchTerm.toLowerCase()

  // 1. Direct match in Wikimedia map
  for (const [key, url] of Object.entries(WIKIMEDIA_REAL_IMAGES)) {
    if (cacheKey.includes(key) || key.includes(cacheKey)) {
      return url
    }
  }

  if (IMAGE_CACHE[cacheKey]) {
    return IMAGE_CACHE[cacheKey]
  }

  try {
    // 2. Direct Wikipedia Summary API
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
    const res = await fetch(summaryUrl)

    if (res.ok) {
      const data = await res.json()
      const imgUrl = data.originalimage?.source || data.thumbnail?.source
      if (imgUrl) {
        IMAGE_CACHE[cacheKey] = imgUrl
        return imgUrl
      }
    }

    // 3. MediaWiki Search API fallback
    const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=1&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200&format=json&origin=*`
    const searchRes = await fetch(searchApiUrl)
    if (searchRes.ok) {
      const searchData = await searchRes.json()
      const pages = searchData.query?.pages
      if (pages) {
        const pageId = Object.keys(pages)[0]
        const page = pages[pageId]
        const imgUrl = page.original?.source || page.thumbnail?.source
        if (imgUrl) {
          IMAGE_CACHE[cacheKey] = imgUrl
          return imgUrl
        }
      }
    }
  } catch (err) {
    console.warn('Wikipedia image fetch fallback for:', searchTerm, err)
  }

  const finalUrl = defaultFallback || WIKIMEDIA_REAL_IMAGES['udaipur']
  IMAGE_CACHE[cacheKey] = finalUrl
  return finalUrl
}
