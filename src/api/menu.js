import { API_BASE_URL } from '../config/api'

export const getMenuList = async () => {
  const response = await fetch(`${API_BASE_URL}/api/menu/list`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return await response.json()
}