/**
 * Simple event system for NFT updates
 * Allows screens to listen for when NFTs change and need refreshing
 */

type NFTUpdateCallback = () => void

class NFTEventEmitter {
  private listeners: NFTUpdateCallback[] = []

  /**
   * Subscribe to NFT update events
   * Returns an unsubscribe function
   */
  subscribe(callback: NFTUpdateCallback): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  /**
   * Emit an NFT update event
   * Notifies all listeners that NFTs have changed
   */
  emit(): void {
    this.listeners.forEach((listener) => listener())
  }
}

export const nftEvents = new NFTEventEmitter()
