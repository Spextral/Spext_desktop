export default function ({ $axios }) {
  $axios.onRequest((config) => {
    let token = localStorage.getItem('token')
    try {
      token = JSON.parse(token)
    } catch (e) {
      localStorage.removeItem('token')
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}

