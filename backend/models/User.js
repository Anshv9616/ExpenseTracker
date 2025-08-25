const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create a Mongoose Schema for the User collection
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // Must be provided
    },
    email: {
      type: String,
      required: true, // Must be provided
      unique: true,   // No two users can have the same email
    },
    password: {
      type: String,
      required: true, // Will be stored as a hashed value
    },
    profileImageUrl: {
      type: String,
      default: null, // Optional; if not provided, defaults to null
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
  }
);

/**
 * Pre-save middleware:
 * Runs before a user document is saved to the database.
 * 
 * - Checks if the password field was modified (for new users or password changes)
 * - If modified, hashes the password before storing it
 */
UserSchema.pre("save", async function (next) {
  // Only hash if password was changed or user is new
  if (!this.isModified("password")) return next();

  // Hash the password using bcrypt (10 salt rounds)
  this.password = await bcrypt.hash(this.password, 10);

  // Proceed to the next middleware or save operation
  next();
});

/**
 * Instance method to compare entered password with stored hashed password
 * 
 * @param {string} candidatePassword - Plain text password from login input
 * @returns {boolean} - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model so it can be used in controllers/routes
module.exports = mongoose.model("User", UserSchema);
