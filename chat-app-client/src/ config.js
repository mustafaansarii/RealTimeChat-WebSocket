const config = {
  Backend_Api: import.meta.env.VITE_Backend_Api || "http://localhost:8080",  // Fallback to a default URL
};

export default config;
