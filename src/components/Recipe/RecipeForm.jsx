"use client";

import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { CldUploadWidget } from "next-cloudinary";
import { FaUpload } from "react-icons/fa";

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
  userId,
}) {
  return (
    <Form onSubmit={onSubmit} className="p-4 shadow-sm rounded bg-white">
      <h4 className="mb-4">Add a New Recipe</h4>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={recipe.title}
          onChange={onChange}
          required
          placeholder="e.g., Chocolate Cake"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={recipe.description}
          onChange={onChange}
          rows={2}
          placeholder="Brief description of your recipe"
        />
      </Form.Group>

      {/* Prep Time, Cook Time, Servings, Difficulty */}

      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Prep Time (min)</Form.Label>
            <Form.Control
              type="number"
              name="prepTime"
              value={recipe.prepTime}
              onChange={onChange}
              min={1}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Cook Time (min)</Form.Label>
            <Form.Control
              type="number"
              name="cookTime"
              value={recipe.cookTime}
              onChange={onChange}
              min={1}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Servings</Form.Label>
            <Form.Control
              type="number"
              name="servings"
              value={recipe.servings}
              onChange={onChange}
              min={1}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Difficulty</Form.Label>
            <Form.Select
              name="difficulty"
              value={recipe.difficulty}
              onChange={onChange}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Ingredients */}

      <Form.Group className="mb-4">
        <Form.Label>Ingredients</Form.Label>
        {recipe.ingredients.map((ing, idx) => (
          <Row key={idx} className="align-items-center mb-2">
            <Col>
              <Form.Control
                placeholder="Ingredient (e.g., Sugar)"
                value={ing.name}
                onChange={(e) => onIngredientChange(idx, "name", e.target.value)}
                required={idx === 0}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={ing.amount}
                onChange={(e) =>
                  onIngredientChange(idx, "amount", e.target.value)
                }
                min={0}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Unit (g, cups, tsp)"
                value={ing.unit}
                onChange={(e) => onIngredientChange(idx, "unit", e.target.value)}
              />
            </Col>
            <Col xs="auto">
              {idx > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeIngredientField(idx)}
                >
                  ✕
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={addIngredientField}
        >
          + Add Ingredient
        </Button>
      </Form.Group>

      {/* Instructions */}
      
      <Form.Group className="mb-4">
        <Form.Label>Instructions</Form.Label>
        {recipe.instructions.map((instr, idx) => (
          <Row key={idx} className="mb-3">
            <Col>
            <Form.Control
              as="textarea"
              value={instr}
              onChange={(e) =>
                onArrayChange("instructions", idx, e.target.value)
              }
              rows={1}
              placeholder={`Step ${idx + 1}`}
              required={idx === 0}
            />
            </Col>
            <Col xs="auto">
            {idx > 0 && (
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-1"
                onClick={() => removeArrayField("instructions", idx)}
              >
                ✕
              </Button>
            )}
            </Col>
          </Row>
        ))}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => addArrayField("instructions")}
        >
          + Add Step
        </Button>
      </Form.Group>

      {/* Tags */}
      <Form.Group className="mb-4">
        <Form.Label>Tags</Form.Label>
        {recipe.tags.map((tag, idx) => (
          <Row key={idx} className="mb-2 align-items-center">
            <Col>
              <Form.Control
                placeholder="e.g., Vegan, Gluten-Free"
                value={tag}
                onChange={(e) => onArrayChange("tags", idx, e.target.value)}
              />
            </Col>
            <Col xs="auto">
              {idx > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeArrayField("tags", idx)}
                >
                  ✕
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => addArrayField("tags")}
        >
          + Add Tag
        </Button>
      </Form.Group>

      {/* Image */}
      <Form.Group className="mb-4">
        <Form.Label>Recipe Image</Form.Label>
        <CldUploadWidget
          cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          uploadPreset="bakemuse_uploads"
          options={{
            maxFiles: 1,
            folder: `bakemuse/user_uploads/${userId}`,
          }}
          onQueuesStart={() => setUploading(true)}
          onSuccess={(result) => {
            const uploadInfo = result?.info || result;
            if (uploadInfo) {
              onImageUpload(uploadInfo);
              setUploading(false);
            }
          }}
          onError={() => setUploading(false)}
          onClose={() => setUploading(false)}
        >
          {({ open }) => (
            <>
              <Button
                type="button"
                variant="outline-primary"
                onClick={() => open()}
                disabled={uploading}
              >
                <FaUpload className="me-1" />
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
              {uploading && (
                <Spinner animation="border" size="sm" className="ms-2" />
              )}
            </>
          )}
        </CldUploadWidget>

        {recipe.image?.url && (
          <img
            src={recipe.image.url}
            alt="Preview"
            className="img-thumbnail mt-2"
            style={{ maxHeight: "120px" }}
          />
        )}
      </Form.Group>

      {/* Submit */}
      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        className="w-100 py-2"
      >
        {isSubmitting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Saving Recipe...
          </>
        ) : (
          "Save Recipe"
        )}
      </Button>
    </Form>
  );
}
