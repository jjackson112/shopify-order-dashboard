// central API layer - call requests from here
// looks separately into localStorage
// inject token from context - make API depend on token
// exporting a static object > move API into a factory function

const BASE_URL = "http://localhost:5000/api";

// global 401 handling + unified error handling
const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("auth:expired"))
    throw new Error("401 - Unauthorized")
  }

  if (res.status === 204) {
    return null
  }

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`${res.status} - ${errorText}`)
  }

  return res.json()
}

// avoid repitition - turn headers into a helper method 
const getHeaders = () => {

    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    }
}

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders()
    })

    return handleResponse(res);
  },

  post: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders()
    });

    return handleResponse(res);
  },

  patch: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders()
    })

    return handleResponse(res)
  },

  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders()
    })

    return handleResponse(res)
  }
}