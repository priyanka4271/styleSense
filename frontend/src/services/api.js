const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getRecommendations = async (userData) => {
  const res = await fetch(`${BASE_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('API failed');
  return res.json();
};

export const detectSkinTone = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  const res = await fetch(`${BASE_URL}/detect-skin-tone`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Detection failed');
  return res.json();
};

export const healthCheck = async () => {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
};
