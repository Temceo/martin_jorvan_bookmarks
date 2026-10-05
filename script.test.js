import {
  validateField,
  validateTitle,
  validateDescription,
  validateUrl,
} from './validation.js';

beforeEach(() => {
  document.body.innerHTML = `
    <input id="title" />
    <p id="title-error"></p>
    <input id="url" />
    <p id="url-error"></p>
    <textarea id="description"></textarea>
    <p id="description-error"></p>
  `;
});

test.each([
  {
    id: 'title',
    validate: validateTitle,
    value: '',
    expectedError: 'Title is required',
  },
  {
    id: 'description',
    validate: validateDescription,
    value: '',
    expectedError: 'Description is required',
  },
  {
    id: 'url',
    validate: validateUrl,
    value: 'ftp://example.com',
    expectedError: 'URL must start with http:// or https://',
  },
  {
    id: 'url',
    validate: validateUrl,
    value: '',
    expectedError: 'URL is required',
  },
])(
  'marks invalid $id with value "$value"',
  ({ id, validate, value, expectedError }) => {
    const field = {
      input: document.getElementById(id),
      error: document.getElementById(`${id}-error`),
      validate,
    };
    field.input.value = value;

    expect(validateField(field)).toBe(false);
    expect(field.input.getAttribute('aria-invalid')).toBe('true');
    expect(field.error.textContent).toBe(expectedError);
  }
);
