import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { ApplicationForm } from '../components/ApplicationForm';
import { LoadingState, ErrorState } from '../components/States';
import { Badge } from '../components/Badge';
import { motion } from 'framer-motion';

export function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedJob, apps] = await Promise.all([
        api.getJobById(id),
        api.getApplications()
      ]);
      setJob(fetchedJob);
      setIsApplied(apps.some(app => app.jobId === id));
    } catch (err) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading job details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchJob} />;
  if (!job) return <ErrorState message="Job not found" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <Link 
        to="/" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
        className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8 relative"
      >
        {isApplied && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute top-8 right-8"
          >
            <Badge variant="success">Applied</Badge>
          </motion.div>
        )}
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
        <div className="text-xl text-indigo-600 font-medium mb-6">{job.company}</div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
            {job.location}
          </div>
          <div className="flex items-center text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
            {job.workMode}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">About the role</h3>
          <p className="text-slate-600 leading-relaxed">
            {job.description}
          </p>
        </div>
      </motion.div>

      {!isApplied ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
          id="application-form"
        >
          <ApplicationForm 
            job={job} 
            onSuccess={() => setIsApplied(true)} 
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">You have applied to this job</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Your application for the {job.title} role at {job.company} has been submitted successfully.
          </p>
          <Link 
            to="/applications" 
            className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            View My Applications
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
