export const validateAnswers = (questions, formData) => {
  const errors = {};
  let isValid = true;

  questions.forEach(q => {
    const val = formData[q.id];
    if (q.required) {
      if (q.type === 'text' || q.type === 'textarea' || q.type === 'dropdown') {
        if (!val || typeof val !== 'string' || val.trim() === '') {
          errors[q.id] = 'This field is required';
          isValid = false;
        }
      }
      if (q.type === 'number') {
        if (val === undefined || val === null || val === '') {
          errors[q.id] = 'This field is required';
          isValid = false;
        }
      }
      if (q.type === 'checkbox') {
        if (!Array.isArray(val) || val.length === 0) {
          errors[q.id] = 'Please select at least one option';
          isValid = false;
        }
      }
      if (q.type === 'boolean') {
        if (val !== true && val !== false) {
          errors[q.id] = 'Please select Yes or No';
          isValid = false;
        }
      }
    }
  });

  return { isValid, errors };
};
