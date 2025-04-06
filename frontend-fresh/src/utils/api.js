// Placeholder API functions
export const login = async (email, password) => {
  return { user: { id: '1', username: 'testuser', email, role: 'Employee' } };
};

export const logout = async () => {
  return { message: 'Logged out successfully' };
};

export const signup = async (username, email, password, role) => {
  return { user: { id: '2', username, email, role } };
};

export const getCurrentUser = async () => {
  return { id: '1', username: 'testuser', email: 'test@example.com', role: 'Employee' };
};