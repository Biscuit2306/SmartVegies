import api from "./api";

const buyerService = {
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await api.get("/buyer/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Marketplace
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get("/buyer/marketplace", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductDetails: async (productId) => {
    try {
      const response = await api.get(`/buyer/marketplace/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cart
  getCart: async () => {
    try {
      const response = await api.get("/buyer/cart");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post("/buyer/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/buyer/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCartQuantity: async (cartItemId, quantity) => {
    try {
      const response = await api.put(`/buyer/cart/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Orders
  getOrders: async () => {
    try {
      const response = await api.get("/buyer/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  placeOrder: async (orderData) => {
    try {
      const response = await api.post("/buyer/orders", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk Orders
  placeBulkOrder: async (bulkOrderData) => {
    try {
      const response = await api.post("/buyer/bulk-orders", bulkOrderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await api.get("/buyer/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/buyer/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default buyerService;
