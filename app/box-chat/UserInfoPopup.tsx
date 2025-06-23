// components/UserInfoPopup.tsx

'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, Navigation, ExternalLink, Copy, Check, Info } from 'lucide-react'

interface Location {
  id: string
  latitude: number
  longitude: number
  detail: string
}

interface UserInfo {
  id: string
  username: string
  email: string
  createdAt: string
  locations: Location[]
}

export default function UserInfoPopup({ onClose }: { onClose: () => void }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [newLocation, setNewLocation] = useState({ latitude: '', longitude: '', detail: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [copiedCoords, setCopiedCoords] = useState(false)

  // Fetch user info khi component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch('/api/user/info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUserInfo(data.userInfo)
      } else {
        console.error('Failed to fetch user info')
      }
    }

    fetchUserInfo()
  }, [])

  // Get current location using browser geolocation
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject, 
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      })

      const { latitude, longitude } = position.coords
      
      setNewLocation(prev => ({
        ...prev,
        latitude: Number(latitude).toFixed(6),
        longitude: Number(longitude).toFixed(6),
      }))


      // Optional: Set a generic detail if empty
      if (!newLocation.detail.trim()) {
        setNewLocation(prev => ({
          ...prev,
          detail: `Vị trí hiện tại (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        }))
      }
      
    } catch (error) {
      console.error('Failed to get current location:', error)
      alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí hoặc nhập tọa độ thủ công.')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Open Google Maps to get coordinates
  const openGoogleMaps = () => {
    const url = 'https://www.google.com/maps'
    window.open(url, '_blank')
  }

  // Copy coordinates to clipboard
  const copyCoordinates = async () => {
    if (!newLocation.latitude || !newLocation.longitude) return
    
    const coords = `${newLocation.latitude}, ${newLocation.longitude}`
    
    try {
      await navigator.clipboard.writeText(coords)
      setCopiedCoords(true)
      setTimeout(() => setCopiedCoords(false), 2000)
    } catch (error) {
      console.error('Failed to copy coordinates:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = coords
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedCoords(true)
      setTimeout(() => setCopiedCoords(false), 2000)
    }
  }

  const handleAddLocation = async () => {
    if (!newLocation.latitude || !newLocation.longitude || !newLocation.detail) return
    
    // Validate coordinates
    const lat = parseFloat(newLocation.latitude)
    const lng = parseFloat(newLocation.longitude)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Tọa độ không hợp lệ. Vui lòng kiểm tra lại.')
      return
    }

    setIsSubmitting(true)

    const res = await fetch('/api/location/user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        detail: newLocation.detail,
      }),
    })

    if (res.ok) {
      const newLoc = await res.json()
      setUserInfo((prev) =>
        prev
          ? { ...prev, locations: [newLoc.location, ...prev.locations] }
          : prev
      )
      setNewLocation({ latitude: '', longitude: '', detail: '' })
    } else {
      alert('Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.')
    }

    setIsSubmitting(false)
  }

  // Validate coordinate format
  const validateCoordinate = (value: string, type: 'lat' | 'lng'): boolean => {
    if (!value) return true // Allow empty
    const num = parseFloat(value)
    if (isNaN(num)) return false
    
    if (type === 'lat') return num >= -90 && num <= 90
    return num >= -180 && num <= 180
  }

  if (!userInfo) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl relative flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Thông tin người dùng</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="space-y-2">
              <p><strong>ID:</strong> {userInfo.id}</p>
              <p><strong>Username:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Ngày tạo:</strong> {new Date(userInfo.createdAt).toLocaleString()}</p>
            </div>

            {/* Add Location Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Thêm địa chỉ mới</h3>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                >
                  <Info size={16} />
                  Hướng dẫn
                </button>
              </div>

              {/* Instructions */}
              {showInstructions && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Cách lấy tọa độ từ Google Maps:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Mở Google Maps bằng nút bên dưới</li>
                    <li>Tìm kiếm hoặc điều hướng đến vị trí mong muốn</li>
                    <li>Nhấp chuột phải vào điểm chính xác trên bản đồ</li>
                    <li>Trong menu xuất hiện, nhấp vào tọa độ (2 số đầu tiên)</li>
                    <li>Tọa độ sẽ được copy tự động, paste vào ô bên dưới</li>
                  </ol>
                  <div className="mt-3">
                    <button
                      onClick={openGoogleMaps}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      <ExternalLink size={16} />
                      Mở Google Maps
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <Navigation size={16} />
                    {isLoadingLocation ? 'Đang lấy...' : 'Vị trí hiện tại'}
                  </button>
                  
                  <button
                    onClick={openGoogleMaps}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    <ExternalLink size={16} />
                    Google Maps
                  </button>

                  {(newLocation.latitude && newLocation.longitude) && (
                    <button
                      onClick={copyCoordinates}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                    >
                      {copiedCoords ? <Check size={16} /> : <Copy size={16} />}
                      {copiedCoords ? 'Đã copy!' : 'Copy tọa độ'}
                    </button>
                  )}
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Mô tả địa điểm (ví dụ: Nhà riêng, Văn phòng...)"
                      value={newLocation.detail}
                      onChange={(e) => setNewLocation({ ...newLocation, detail: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          placeholder="Latitude (vĩ độ)"
                          value={newLocation.latitude}
                          onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
                          className={`w-full border rounded px-3 py-2 text-sm ${
                            newLocation.latitude && !validateCoordinate(newLocation.latitude, 'lat') 
                              ? 'border-red-500' : ''
                          }`}
                        />
                        {newLocation.latitude && !validateCoordinate(newLocation.latitude, 'lat') && (
                          <p className="text-red-500 text-xs mt-1">Vĩ độ phải từ -90 đến 90</p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Longitude (kinh độ)"
                          value={newLocation.longitude}
                          onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
                          className={`w-full border rounded px-3 py-2 text-sm ${
                            newLocation.longitude && !validateCoordinate(newLocation.longitude, 'lng') 
                              ? 'border-red-500' : ''
                          }`}
                        />
                        {newLocation.longitude && !validateCoordinate(newLocation.longitude, 'lng') && (
                          <p className="text-red-500 text-xs mt-1">Kinh độ phải từ -180 đến 180</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddLocation}
                      disabled={
                        isSubmitting || 
                        !newLocation.latitude || 
                        !newLocation.longitude || 
                        !newLocation.detail ||
                        !validateCoordinate(newLocation.latitude, 'lat') ||
                        !validateCoordinate(newLocation.longitude, 'lng')
                      }
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Đang thêm...' : 'Thêm địa chỉ'}
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <h4 className="font-medium text-sm mb-2">Xem trước:</h4>
                    {newLocation.latitude && newLocation.longitude ? (
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Mô tả:</strong> {newLocation.detail || 'Chưa nhập'}</p>
                        <p className="text-sm"><strong>Tọa độ:</strong> {newLocation.latitude}, {newLocation.longitude}</p>
                        {validateCoordinate(newLocation.latitude, 'lat') && validateCoordinate(newLocation.longitude, 'lng') && (
                          <a
                            href={`https://www.google.com/maps?q=${newLocation.latitude},${newLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                          >
                            <ExternalLink size={14} />
                            Xem trên Google Maps
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nhập tọa độ để xem trước</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location List */}
            <div>
              <h3 className="text-lg font-medium mb-3">Danh sách địa chỉ ({userInfo.locations.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userInfo.locations.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">Chưa có địa chỉ nào</p>
                ) : (
                  userInfo.locations.map((loc) => (
                    <div key={loc.id} className="border rounded-lg p-3 hover:bg-gray-50 transition">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{loc.detail}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {Number(loc.latitude).toFixed(6)}, {Number(loc.longitude).toFixed(6)}
                          </p>
                          <a
                            href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs"
                          >
                            <ExternalLink size={12} />
                            Xem trên bản đồ
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}