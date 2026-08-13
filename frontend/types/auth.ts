// Represents the authenticated user's data returned by the API.
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string; // ? means the property is optional.
  updated_at?: string;
}

// Represents the response returned by the login/register API.
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
