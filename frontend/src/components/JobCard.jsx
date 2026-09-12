import { Link } from 'react-router-dom';
import { MapPin, Briefcase, FileQuestion } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../utils/toast';
import { motion } from 'framer-motion';

export function JobCard({ job, isSelected, onToggleSelect, isApplied }) {
  // Entrance animation variants (used by parent stagger)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={itemVariants}
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ layout: { duration: 0.3, type: "spring" } }}
      className={cn(
        "group relative bg-white/95 backdrop-blur-sm rounded-xl border p-6 transition-colors duration-200 shadow-md",
        isSelected ? "border-indigo-500 shadow-lg ring-2 ring-indigo-500/50" : "border-slate-200/80 hover:border-indigo-300 hover:shadow-xl"
      )}
    >
      <div className="absolute top-6 right-6">
        <label className="cursor-pointer relative flex items-center justify-center w-6 h-6 rounded border-2 border-slate-400 bg-white hover:border-indigo-500 transition-colors">
          <input 
            type="checkbox" 
            className="peer sr-only"
            checked={isSelected}
            onChange={() => onToggleSelect(job.id)}
            disabled={isApplied}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-indigo-600 rounded border-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </label>
      </div>

      <div className="pr-10">
        <h3 className="text-xl font-semibold text-slate-900 mb-1">
          {job.title}
        </h3>
        <div className="text-indigo-600 font-medium text-sm mb-4">
          {job.company}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-sm text-slate-500 gap-1.5">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-1.5">
            <Briefcase className="w-4 h-4" />
            {job.workMode}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6 line-clamp-2">
          {job.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {isApplied ? (
            <Badge variant="success">Applied</Badge>
          ) : (
            <div />
          )}
          
          <Link 
            to={`/jobs/${job.id}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View Details
            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
