import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, FileText } from 'lucide-react';
import { api } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { Badge } from '../components/Badge';

export function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading your applications..." />;
  if (error) return <ErrorState message={error} onRetry={fetchApplications} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-500">Track the jobs you've applied to.</p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{app.jobTitle}</h3>
                <div className="text-indigo-600 font-medium text-sm mb-3">{app.company}</div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {app.workMode}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge variant="success">
                  {app.status}
                </Badge>
                <Link 
                  to={`/jobs/${app.jobId}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors mt-2 md:mt-0"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          message="Jobs you apply to will appear here."
          action={
            <Link 
              to="/"
              className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Browse Jobs
            </Link>
          }
        />
      )}
    </div>
  );
}
