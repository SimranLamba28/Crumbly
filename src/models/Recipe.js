import mongoose, {Schema} from 'mongoose';

// models/Recipe.js
const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [{
    name: String,
    amount: Number,
    unit: String,
    original: String
  }],
  instructions: [{ step: Number, text: String }],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  tags: [String],
  image: {
    public_id: { type: String }, // Cloudinary public ID
    url: { type: String },       // Cloudinary secure URL
    
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  source: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
});

recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Recipe = mongoose.models?.Recipe || mongoose.model('Recipe', recipeSchema);


export default Recipe;
