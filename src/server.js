const app = require("./app");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
require("./config/db")();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
