// lib/location.ts

export async function getClientCoordinates(): Promise<{
  latitude: number | null
  longitude: number | null
}> {
  if (typeof window === 'undefined') return { latitude: null, longitude: null }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        resolve({ latitude, longitude })
      },
      () => {
        resolve({ latitude: null, longitude: null })
      }
    )
  })
}
