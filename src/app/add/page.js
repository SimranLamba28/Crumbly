'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container, Alert, Spinner } from 'react-bootstrap';
import styles from '@/styles/RecipeForm.module.css';
import RecipeForm from '@/components/RecipeForm';


export default function AddRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [ { name: '', amount: '', unit: '' } ],
    instructions: [''],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    tags: [''],
    image: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredientField = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const removeIngredientField = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...recipe[field]];
    newArray[index] = value;
    setRecipe(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setRecipe(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field, index) => {
    const newArray = recipe[field].filter((_, i) => i !== index);
    setRecipe(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = (info) => {
  setRecipe(prev => ({
    ...prev,
    image: {
      public_id: info.public_id,
      url: info.secure_url
    }
  }));
  setUploading(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError('Please sign in to add recipes');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const transformed = {
        ...recipe,
        ingredients: recipe.ingredients.map(item => ({
          name: item.name,
          amount: item.amount,
          unit: item.unit,
          original: `${item.amount} ${item.unit} ${item.name}`
        })),
        instructions: recipe.instructions.map(text => ({ text })),
        creator: session.user.id,
        source: 'user',
        image: recipe.image
      };

      const response = await axios.post('/api/recipes', transformed);

      if (response.data.message === 'Recipe saved successfully') {
        router.push('/your-recipes');
      } else {
        throw new Error('Failed to save recipe');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save recipe');
      if (recipe.image?.public_id) {
        await axios.post('/api/cloudinary/delete', { publicId: recipe.image.public_id });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <h4>Sign in to add recipes!</h4>
          <p>You need to be logged in to contribute to our baking community.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className={`${styles.recipeForm} my-5`}>
      <h1 className="text-center mb-4">Add New Recipe</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <RecipeForm
        recipe={recipe}
        onChange={handleChange}
        onIngredientChange={handleIngredientChange}
        addIngredientField={addIngredientField}
        removeIngredientField={removeIngredientField}
        onArrayChange={handleArrayChange}
        addArrayField={addArrayField}
        removeArrayField={removeArrayField}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        uploading={uploading}
        setUploading={setUploading}
        userId={session?.user?.id}
      />
    </Container>
  );
}