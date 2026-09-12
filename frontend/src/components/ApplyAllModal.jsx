import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { QuestionRenderer } from './QuestionRenderer';
import { api } from '../services/api';
import { toast } from '../utils/toast';
import { validateAnswers } from '../utils/validation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ApplyAllModal({ isOpen, onClose, selectedJobs, appliedJobIds, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  
  // State for all jobs' data and errors
  // { [jobId]: { [questionId]: value } }
  const [bulkFormData, setBulkFormData] = useState({});
  // { [jobId]: { [questionId]: errorMessage } }
  const [bulkErrors, setBulkErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setBulkFormData({});
      setBulkErrors({});
      // Expand the first pending job by default
      const firstPending = selectedJobs.find(job => !appliedJobIds.includes(job.id));
      if (firstPending) {
        setExpandedJobId(firstPending.id);
      }
    }
  }, [isOpen, selectedJobs, appliedJobIds]);

  const handleFieldChange = (jobId, questionId, value) => {
    setBulkFormData(prev => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || {}),
        [questionId]: value
      }
    }));
    
    // Clear error for this field
    if (bulkErrors[jobId]?.[questionId]) {
      setBulkErrors(prev => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          [questionId]: null
        }
      }));
    }
  };

  const getJobStatus = (job) => {
    if (appliedJobIds.includes(job.id)) return 'APPLIED';
    
    const { isValid } = validateAnswers(job.questions, bulkFormData[job.id] || {});
    return isValid ? 'READY' : 'WARNING';
  };

  const pendingJobs = selectedJobs.filter(job => !appliedJobIds.includes(job.id));
  const readyJobs = pendingJobs.filter(job => getJobStatus(job) === 'READY');
  const missingCount = pendingJobs.length - readyJobs.length;

  const handleApplyAll = async () => {
    if (pendingJobs.length === 0) {
      toast('No pending jobs to apply for.', 'error');
      return;
    }

    const newBulkErrors = {};
    let allValid = true;
    let firstInvalidJobId = null;

    // Validate all pending jobs
    pendingJobs.forEach(job => {
      const { isValid, errors } = validateAnswers(job.questions, bulkFormData[job.id] || {});
      if (!isValid) {
        newBulkErrors[job.id] = errors;
        allValid = false;
        if (!firstInvalidJobId) {
          firstInvalidJobId = job.id;
        }
      }
    });

    if (!allValid) {
      setBulkErrors(newBulkErrors);
      setExpandedJobId(firstInvalidJobId);
      toast('Please complete all required questions.', 'error');
      return;
    }

    // Build payload
    const applicationsData = pendingJobs.map(job => ({
      jobId: job.id,
      data: bulkFormData[job.id] || {}
    }));

    setIsSubmitting(true);
    try {
      const response = await api.applyToAll(applicationsData);
      
      const successCount = response.results?.length || 0;
      const errorCount = response.errors?.length || 0;
      
      if (errorCount === 0) {
        toast(`Successfully applied to ${successCount} jobs!`, 'success');
      } else if (successCount > 0) {
        toast(`Applied to ${successCount} jobs. ${errorCount} failed.`, 'warning');
      } else {
        toast(`Failed to apply to jobs.`, 'error');
      }
      
      onSuccess();
    } catch (error) {
      toast(error.message || 'An error occurred while submitting applications.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Application"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleApplyAll}
            disabled={pendingJobs.length === 0 || isSubmitting}
            isLoading={isSubmitting}
          >
            Submit {pendingJobs.length} Applications
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600 mb-4">
          Please fill out the required questions for each job before submitting.
        </p>

        <div className="space-y-4">
          {selectedJobs.map(job => {
            const status = getJobStatus(job);
            const isExpanded = expandedJobId === job.id;
            const isApplied = status === 'APPLIED';
            const hasErrors = Object.keys(bulkErrors[job.id] || {}).length > 0;
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={job.id} 
                className={`rounded-xl border ${hasErrors ? 'border-red-300' : 'border-slate-200'} bg-slate-50 overflow-hidden transition-colors`}
              >
                {/* Header / Accordion Trigger */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 ${isExpanded ? 'bg-slate-100 border-b border-slate-200' : ''}`}
                  onClick={() => !isApplied && setExpandedJobId(isExpanded ? null : job.id)}
                >
                  <div>
                    <h4 className="font-medium text-slate-900">{job.title}</h4>
                    <p className="text-sm text-slate-500">{job.company}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {status === 'READY' && (
                      <Badge variant="success" className="hidden sm:inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Ready
                      </Badge>
                    )}
                    {status === 'WARNING' && (
                      <Badge variant="warning" className="hidden sm:inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Missing Answers
                      </Badge>
                    )}
                    {isApplied && (
                      <Badge variant="default" className="hidden sm:inline-flex items-center gap-1">
                        Applied
                      </Badge>
                    )}
                    
                    {!isApplied && (
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body / Questions Form */}
                <AnimatePresence initial={false}>
                  {isExpanded && !isApplied && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-white overflow-hidden"
                    >
                      <div className="p-4 space-y-6">
                        {job.questions.length > 0 ? (
                          job.questions.map(question => (
                            <QuestionRenderer
                              key={question.id}
                              question={question}
                              value={(bulkFormData[job.id] || {})[question.id]}
                              onChange={(val) => handleFieldChange(job.id, question.id, val)}
                              error={(bulkErrors[job.id] || {})[question.id]}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic">No additional questions required.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
