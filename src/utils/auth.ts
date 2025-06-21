export const logout = () => {
  localStorage.removeItem('fanCollectorsMediaToken');
  window.location.href = '/login';
};