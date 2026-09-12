let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (base.endsWith('/')) base = base.slice(0, -1);
if (!base.endsWith('/api')) base += '/api';
const API_URL = base;

export const api = {
  getJobs: async () => {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch jobs');
    }
    return res.json();
  },

  getJobById: async (id) => {
    const res = await fetch(`${API_URL}/jobs/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch job');
    }
    return res.json();
  },

  applyToJob: async (jobId, data) => {
    const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to apply');
    }
    return res.json();
  },

  applyToAll: async (applicationsData) => {
    const res = await fetch(`${API_URL}/applications/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationsData)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to submit bulk applications');
    }
    return res.json();
  },

  getApplications: async () => {
    const res = await fetch(`${API_URL}/applications`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch applications');
    }
    return res.json();
  }
};
