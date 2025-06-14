import pinecone from '../services/partners/pinecone.service'

interface IndexStats {
  indexName: string
  dimension: number
  totalVectors: number
  totalStorage: number // in MB
  metadataStorage: number // in MB
  vectorStorage: number // in MB
}

async function calculateStorageUsage(
  indexName: string,
  dimension: number
): Promise<IndexStats> {
  try {
    const index = pinecone.index(indexName)

    // Get index statistics
    const stats = await index.describeIndexStats()
    const totalVectors = stats.totalRecordCount || 0

    // Calculate storage
    // Each vector dimension is stored as a 32-bit float (4 bytes)
    const vectorStorage = (totalVectors * dimension * 4) / (1024 * 1024) // Convert to MB

    // Estimate metadata storage (rough estimate)
    // Assuming each metadata entry is about 500 bytes
    const metadataStorage = (totalVectors * 500) / (1024 * 1024) // Convert to MB

    const totalStorage = vectorStorage + metadataStorage

    return {
      indexName,
      dimension,
      totalVectors,
      totalStorage,
      metadataStorage,
      vectorStorage,
    }
  } catch (error) {
    console.error(`Error calculating storage for index ${indexName}:`, error)
    throw error
  }
}

async function analyzeStorage() {
  const indexes = [
    {
      name: 'openai-ada-002',
      dimension: 1536,
    },
    {
      name: 'electronics-3-large',
      dimension: 3072,
    },
  ]

  console.log('Analyzing Pinecone storage usage...\n')

  for (const index of indexes) {
    try {
      const stats = await calculateStorageUsage(index.name, index.dimension)

      console.log(`Index: ${stats.indexName}`)
      console.log('----------------------------------------')
      console.log(`Total vectors: ${stats.totalVectors.toLocaleString()}`)
      console.log(`Vector dimension: ${stats.dimension}`)
      console.log(`Vector storage: ${stats.vectorStorage.toFixed(2)} MB`)
      console.log(
        `Estimated metadata storage: ${stats.metadataStorage.toFixed(2)} MB`
      )
      console.log(
        `Total estimated storage: ${stats.totalStorage.toFixed(2)} MB`
      )
      console.log('----------------------------------------\n')
    } catch (error) {
      console.error(`Failed to analyze index ${index.name}:`, error)
    }
  }
}

analyzeStorage()
