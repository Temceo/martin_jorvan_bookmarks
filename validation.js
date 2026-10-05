export function validateTitle(value) {
  if (value.trim() === '') {
    return 'Title is required';
  }
  return true;
}

export function validateDescription(value) {
  if (value.trim() === '') {
    return 'Description is required';
  }
  return true;
}

export function validateUrl(value) {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return 'URL is required';
  }

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'URL must start with http:// or https://';
    }
    return true;
  } catch {
    return 'Enter a valid URL, starting with http:// or https://';
  }
}

export const fields = [
  {
    input: document.getElementById('title'),
    error: document.getElementById('title-error'),
    validate: validateTitle,
  },
  {
    input: document.getElementById('url'),
    error: document.getElementById('url-error'),
    validate: validateUrl,
  },
  {
    input: document.getElementById('description'),
    error: document.getElementById('description-error'),
    validate: validateDescription,
  },
];

export function validateField(field) {
  const result = field.validate(field.input.value);
  const isValid = result === true;

  field.input.setAttribute('aria-invalid', String(!isValid));
  field.error.textContent = isValid ? '' : result;

  return isValid;
}

export function resetFieldErrors() {
  fields.forEach((field) => {
    field.input.removeAttribute('aria-invalid');
    field.error.textContent = '';
  });
}
