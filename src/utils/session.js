export function getSessionId() {
  const SESSION_KEY = 'phishguard_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a simple unique ID (UUID v4 format approximation)
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}
