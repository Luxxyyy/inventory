import http from '../api/http';

// Define types for our authentication service
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  image?: string | null; // data URL thumbnail (50x50)
  full_image?: string | null; // full-size data URL
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
  image?: string | null; // thumbnail data URL
  full_image?: string | null; // full image data URL
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await http.post('/auth/login', credentials);
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await http.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await http.get('/auth/user');
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Register a new user (admin only)
  async register(userData: RegisterData): Promise<User> {
    try {
      // registered route used by frontend admin form
      const response = await http.post('/auth/register', userData);
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
