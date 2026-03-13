import api from "./api";

const farmerService = {
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await api.get("/farmer/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crops
  getCrops: async () => {
    try {
      const response = await api.get("/farmer/crops");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addCrop: async (cropData) => {
    try {
      const response = await api.post("/farmer/crops", cropData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCrop: async (cropId, cropData) => {
    try {
      const response = await api.put(`/farmer/crops/${cropId}`, cropData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCrop: async (cropId) => {
    try {
      const response = await api.delete(`/farmer/crops/${cropId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Orders
  getOrders: async () => {
    try {
      const response = await api.get("/farmer/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/farmer/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk Requests
  getBulkRequests: async () => {
    try {
      const response = await api.get("/farmer/bulk-requests");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  respondToBulkRequest: async (requestId, response) => {
    try {
      const result = await api.post(`/farmer/bulk-requests/${requestId}/respond`, response);
      return result.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Earnings
  getEarnings: async (period = "month") => {
    try {
      const response = await api.get(`/farmer/earnings?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await api.get("/farmer/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/farmer/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default farmerService;
