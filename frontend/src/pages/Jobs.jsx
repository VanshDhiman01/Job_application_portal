import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobSelectionBar } from '../components/JobSelectionBar';
import { ApplyAllModal } from '../components/ApplyAllModal';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');

  // Selection
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [isApplyAllModalOpen, setIsApplyAllModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedJobs, fetchedApps] = await Promise.all([
        api.getJobs(),
        api.getApplications()
      ]);
      setJobs(fetchedJobs);
      setApplications(fetchedApps);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const appliedJobIds = useMemo(() => {
    return applications.map(app => app.jobId);
  }, [applications]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter ? job.location.includes(locationFilter) : true;
      const matchesWorkMode = workModeFilter ? job.workMode === workModeFilter : true;
      
      return matchesSearch && matchesLocation && matchesWorkMode;
    });
  }, [jobs, searchQuery, locationFilter, workModeFilter]);

  const handleToggleSelect = (jobId) => {
    setSelectedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  if (isLoading) return <LoadingState message="Discovering opportunities..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const uniqueLocations = [...new Set(jobs.map(j => j.location))];
  const uniqueWorkModes = [...new Set(jobs.map(j => j.workMode))];

  // Stagger variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed opacity-40"
        style={{ backgroundImage: 'url("/desk-bg.png")' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 relative"
      >
      <div className="text-center max-w-2xl mx-auto mb-12 drop-shadow-sm">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm">
          Find your next opportunity
        </h1>
        <p className="text-lg text-slate-700 font-medium drop-shadow-sm">
          Explore open positions and apply to the roles that match your skills.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200/60 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>
        
        <div className="flex gap-4 md:w-auto w-full">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="block w-full md:w-48 pl-3 pr-10 py-2.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-slate-50 border transition-colors"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="block w-full md:w-40 pl-3 pr-10 py-2.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-slate-50 border transition-colors"
          >
            <option value="">All Modes</option>
            {uniqueWorkModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                isApplied={appliedJobIds.includes(job.id)}
                isSelected={selectedJobIds.includes(job.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState 
          icon={SearchIcon}
          title="No jobs match your search" 
          message="Try a different title, company, or location."
          action={
            <button 
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('');
                setWorkModeFilter('');
              }}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Clear Filters
            </button>
          }
        />
      )}

      <JobSelectionBar 
        selectedCount={selectedJobIds.length} 
        onClear={() => setSelectedJobIds([])}
        onApplyAll={() => setIsApplyAllModalOpen(true)}
      />

      <ApplyAllModal
        isOpen={isApplyAllModalOpen}
        onClose={() => setIsApplyAllModalOpen(false)}
        selectedJobs={jobs.filter(j => selectedJobIds.includes(j.id))}
        appliedJobIds={appliedJobIds}
        onSuccess={() => {
          setIsApplyAllModalOpen(false);
          setSelectedJobIds([]);
          fetchData(); // refresh application state
        }}
      />
    </motion.div>
    </>
  );
}
