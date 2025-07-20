import mongoose, {Schema} from 'mongoose';

const favoriteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: String,
    required: true
  },
  source: {  // Add this field to distinguish sources
    type: String,
    enum: ['api'],
    required: true,
    default: 'api'
  },
  title: {
    type: String,
    required: true
  },
  image: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a composite unique index on userId and recipeId
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
export default Favorite;