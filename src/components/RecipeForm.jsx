'use client';

import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { CldUploadWidget } from 'next-cloudinary';
import { FaUpload } from 'react-icons/fa';

export default function RecipeForm({
  recipe,
  onChange,
  onIngredientChange,
  addIngredientField,
  removeIngredientField,
  onArrayChange,
  addArrayField,
  removeArrayField,
  onImageUpload,
  onSubmit,
  isSubmitting,
  uploading,
  setUploading,
  userId
}) {
  console.log("Cloud Name being passed to CldUploadWidget:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('user id being sent to form', userId);
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Recipe Title</Form.Label>
        <Form.Control type="text" name="title" value={recipe.title} onChange={onChange} required placeholder="Enter recipe name" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" value={recipe.description} onChange={onChange} rows={2} placeholder="Brief description" />
      </Form.Group>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Prep Time (min)</Form.Label>
            <Form.Control type="number" name="prepTime" value={recipe.prepTime} onChange={onChange} min={1} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Cook Time (min)</Form.Label>
            <Form.Control type="number" name="cookTime" value={recipe.cookTime} onChange={onChange} min={1} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Servings</Form.Label>
            <Form.Control type="number" name="servings" value={recipe.servings} onChange={onChange} min={1} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Difficulty</Form.Label>
            <Form.Select name="difficulty" value={recipe.difficulty} onChange={onChange}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Ingredients</Form.Label>
        {recipe.ingredients.map((ing, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col>
              <Form.Control
                placeholder="Ingredient name"
                value={ing.name}
                onChange={e => onIngredientChange(idx, 'name', e.target.value)}
                required={idx===0}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={ing.amount}
                onChange={e => onIngredientChange(idx, 'amount', e.target.value)}
                min={0}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Unit (e.g., g, cups)"
                value={ing.unit}
                onChange={e => onIngredientChange(idx, 'unit', e.target.value)}
              />
            </Col>
            <Col xs="auto">
              {idx > 0 && (
                <Button variant="outline-danger" onClick={() => removeIngredientField(idx)}>Remove</Button>
              )}
            </Col>
          </Row>
        ))}
        <Button variant="outline-primary" onClick={addIngredientField}>Add Ingredient</Button>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Instructions</Form.Label>
        {recipe.instructions.map((instr, idx) => (
          <div key={idx} className="mb-3">
            <Form.Label>Step {idx+1}</Form.Label>
            <Form.Control
              as="textarea"
              value={instr}
              onChange={e => onArrayChange('instructions', idx, e.target.value)}
              rows={2}
              placeholder="Describe this step"
              required={idx===0}
            />
            {idx>0 && <Button variant="outline-danger" onClick={() => removeArrayField('instructions', idx)}>Remove Step</Button>}
          </div>
        ))}
        <Button variant="outline-primary" onClick={() => addArrayField('instructions')}>Add Step</Button>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tags</Form.Label>
        {recipe.tags.map((tag, idx) => (
          <Row key={idx} className="mb-2 align-items-end">
            <Col>
              <Form.Control
                placeholder="e.g., Vegan"
                value={tag}
                onChange={e => onArrayChange('tags', idx, e.target.value)}
              />
            </Col>
            <Col xs="auto">
              {idx>0 && <Button variant="outline-danger" onClick={() => removeArrayField('tags', idx)}>Remove</Button>}
            </Col>
          </Row>
        ))}
        <Button variant="outline-primary" onClick={() => addArrayField('tags')}>Add Tag</Button>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Recipe Image</Form.Label>
        <CldUploadWidget
          cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          uploadPreset="bakemuse_uploads"
          options={{
            maxFiles: 1,
            singleUploadAutoClose: false,
            folder: `bakemuse/user_uploads/${userId}`,
          }}
          onQueuesStart={() => {
            console.log('Upload started');
            setUploading(true);
          }}
          onSuccess={(result) => {
            console.log('Upload success:', result);
            const uploadInfo = result?.info || result;
            if (uploadInfo) {
              onImageUpload(uploadInfo);
              setUploading(false);
            }
          }}
          onError={(error) => {
            console.error('Upload error:', error);
            setUploading(false);
          }}
          onClose={() => {
            console.log('Widget closed');
            setUploading(false);
          }}
        >
          {({ open }) => (
            <div>
              <Button 
                type="button" 
                variant="outline-primary" 
                onClick={() => open()}
                disabled={uploading}
              >
                <FaUpload className="me-1" /> 
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {uploading && <Spinner animation="border" size="sm" className="ms-2" />}
            </div>
          )}
        </CldUploadWidget>

        {recipe.image?.url && (
          <img
            src={recipe.image.url}
            alt="Preview"
            className="img-thumbnail mt-2"
            style={{ maxHeight: '100px' }}
          />
        )}
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100 py-2">
        {isSubmitting ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>Saving Recipe...</>) : 'Save Recipe'}
      </Button>
    </Form>
  );
}
