const ApiError = require('../utils/apiError');

class ValidationService {
  validateAnswers(questions, answersData) {
    if (!answersData || typeof answersData !== 'object') {
      throw new ApiError(400, 'Invalid answers data format');
    }

    const validAnswers = [];

    for (const question of questions) {
      const answerValue = answersData[question.id];

      // Check required
      if (question.required && (answerValue === undefined || answerValue === null || answerValue === '')) {
        throw new ApiError(400, `Question "${question.label}" is required.`);
      }

      // Skip validation if not required and no answer provided
      if (answerValue === undefined || answerValue === null || answerValue === '') {
        continue;
      }

      // Type-specific validation
      switch (question.type) {
        case 'text':
        case 'textarea':
          if (typeof answerValue !== 'string') {
            throw new ApiError(400, `Answer for "${question.label}" must be text.`);
          }
          break;
        
        case 'number':
          if (isNaN(Number(answerValue))) {
            throw new ApiError(400, `Answer for "${question.label}" must be a number.`);
          }
          break;

        case 'boolean':
          if (typeof answerValue !== 'boolean') {
            throw new ApiError(400, `Answer for "${question.label}" must be boolean.`);
          }
          break;

        case 'dropdown':
          if (typeof answerValue !== 'string') {
            throw new ApiError(400, `Answer for "${question.label}" must be a string selection.`);
          }
          if (question.options && !question.options.includes(answerValue)) {
            throw new ApiError(400, `Invalid option selected for "${question.label}".`);
          }
          break;

        case 'checkbox':
          if (!Array.isArray(answerValue)) {
            throw new ApiError(400, `Answer for "${question.label}" must be an array of selections.`);
          }
          if (question.options) {
            const invalidOptions = answerValue.filter(v => !question.options.includes(v));
            if (invalidOptions.length > 0) {
              throw new ApiError(400, `Invalid options selected for "${question.label}".`);
            }
          }
          break;

        default:
          break;
      }

      validAnswers.push({
        questionId: question.id,
        value: answerValue
      });
    }

    return validAnswers;
  }
}

module.exports = new ValidationService();
