import mongoose, {Schema} from 'mongoose';

const recipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [{
    name: String,
    amount: Number,
    unit: String,
    original: String
  }],
  instructions: [{text: String }],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  tags: [String],
  image: {
    public_id: { type: String }, 
    url: { type: String },       
    
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

recipeSchema.index({ title: 'text', tags: 'text' });

const Recipe = mongoose.models?.Recipe || mongoose.model('Recipe', recipeSchema);


export default Recipe;
