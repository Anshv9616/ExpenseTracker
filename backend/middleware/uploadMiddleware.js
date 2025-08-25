
// Import Multer, a Node.js middleware for handling `multipart/form-data` (used for file uploads)
const multer = require("multer");

// Configure storage for uploaded files
// `diskStorage` allows us to control the destination folder and file naming
const storage = multer.diskStorage({
    // Destination folder where uploaded files will be stored
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in the 'uploads' directory
    },

    // File naming convention
    filename: (req, file, cb) => {
        // Prefix the file name with the current timestamp to make it unique
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File type filter function
const fileFilter = (req, file, cb) => {
    // Allowed MIME types for image uploads
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
        // If the uploaded file type is allowed
        cb(null, true);
    } else {
        // Reject the file and send an error
        cb(new Error('Only .jpg, .jpeg, and .png formats are allowed'), false);
    }
};

// Initialize Multer upload middleware with the storage config and file filter
const upload = multer({
    storage,      // Use our custom storage configuration
    fileFilter,   // Use our file filter to restrict file types
});

// Export the `upload` middleware so it can be used in routes
module.exports = upload;
