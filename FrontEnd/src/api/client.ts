import axios from 'axios';
import { useAuthStore } from '../store/stores';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

// ── API Functions ──────────────────────────────────────────────────────────

// Auth
export const authApi = {
  login:    (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
  google:   (idToken: string) => api.post('/auth/google', { idToken }),
  me:       () => api.get('/auth/me'),
  refresh:  () => api.post('/auth/refresh'),
};

// Celestial
export const celestialApi = {
  search:   (params: { q: string; type?: string; page?: number; limit?: number }) =>
    api.get('/celestial/search', { params }),
  getBySlug: (slug: string) => api.get(`/celestial/${slug}`),
  nearby:   (params: { ra: number; dec: number; radius?: number }) =>
    api.get('/celestial/nearby/sky', { params }),
  favorite: (id: string) => api.post(`/celestial/${id}/favorite`),
  featured: () => api.get('/celestial/featured/objects'),
};

// NASA
export const nasaApi = {
  apod:        (date?: string) => api.get('/nasa/apod', { params: date ? { date } : {} }),
  neo:         () => api.get('/nasa/neo'),
  marsRover:   (params?: { rover?: string; sol?: number; camera?: string }) =>
    api.get('/nasa/mars-rover', { params }),
  spaceWeather: () => api.get('/nasa/space-weather'),
  iss:         () => api.get('/nasa/iss'),
  issPasses:   (lat: number, lon: number) => api.get('/nasa/iss/passes', { params: { lat, lon } }),
};

// Events
export const eventsApi = {
  list:     (params?: { type?: string; upcoming?: boolean; page?: number }) =>
    api.get('/events', { params }),
  upcoming: () => api.get('/events/upcoming'),
  getById:  (id: string) => api.get(`/events/${id}`),
};

// User
export const userApi = {
  updateProfile: (data: any)    => api.patch('/user/profile', data),
  getFavorites:  ()             => api.get('/user/favorites'),
  getWatchlists: ()             => api.get('/user/watchlists'),
  createWatchlist: (data: any)  => api.post('/user/watchlists', data),
  addToWatchlist: (id: string, data: any) => api.post(`/user/watchlists/${id}/items`, data),
  getObservations: ()           => api.get('/user/observations'),
  createObservation: (data: any) => api.post('/user/observations', data),
};

// AI
export const aiApi = {
  getConversations: () => api.get('/ai/conversations'),
  getConversation:  (id: string) => api.get(`/ai/conversations/${id}`),
  // Streaming chat — handled directly with fetch for SSE
  chatStream: async (
    message: string,
    conversationId: string | null,
    history: Array<{ role: string; content: string }>,
    onChunk: (text: string) => void,
    onDone: (conversationId: string) => void,
  ) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message, conversationId, history }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        const data = JSON.parse(line.replace('data: ', ''));
        if (data.text) onChunk(data.text);
        if (data.done) onDone(data.conversationId);
      }
    }
  },
};

// Quizzes
export const quizApi = {
  list:   () => api.get('/quizzes'),
  get:    (id: string) => api.get(`/quizzes/${id}`),
  submit: (id: string, data: { answers: Record<string, number>; timeTakenSec: number }) =>
    api.post(`/quizzes/${id}/submit`, data),
};

// Notifications
export const notifApi = {
  list:           () => api.get('/notifications'),
  markRead:       (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead:    () => api.patch('/notifications/read-all'),
  setPreferences: (data: any) => api.put('/notifications/preferences', data),
};
