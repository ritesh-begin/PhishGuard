import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Simple check for token in localStorage. 
  // In a real huge app you'd verify it with the backend on every route change,
  // but for this, checking presence is enough since the API is protected anyway.
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
