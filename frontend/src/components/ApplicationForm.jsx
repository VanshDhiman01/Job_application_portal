import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionRenderer } from './QuestionRenderer';
import { Button } from './Button';
import { api } from '../services/api';
import { toast } from '../utils/toast';
import { validateAnswers } from '../utils/validation';

export function ApplicationForm({ job, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const { isValid, errors: newErrors } = validateAnswers(job.questions, formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.applyToJob(job.id, formData);
      toast('Application submitted successfully', 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/applications');
      }
    } catch (error) {
      toast(error.message || 'Failed to submit application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-100">
        Application Questions
      </h3>
      
      <div className="space-y-6">
        {job.questions.map(question => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={formData[question.id]}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, [question.id]: val }));
              if (errors[question.id]) {
                setErrors(prev => ({ ...prev, [question.id]: null }));
              }
            }}
            error={errors[question.id]}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 sm:justify-end">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate('/')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
        >
          Submit Application
        </Button>
      </div>
    </form>
  );
}
