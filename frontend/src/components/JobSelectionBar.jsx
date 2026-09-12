import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export function JobSelectionBar({ selectedCount, onClear, onApplyAll }) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-40"
        >
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 rounded-full px-3 py-1 text-sm font-medium border border-slate-700">
            {selectedCount} selected
          </div>
          <span className="text-sm text-slate-300 font-medium">
            Ready to apply to multiple positions?
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            className="text-slate-300 hover:text-white hover:bg-slate-800 flex-1 sm:flex-none"
            onClick={onClear}
          >
            Clear
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 text-white border-none shadow-indigo-500/25 shadow-lg"
            onClick={onApplyAll}
          >
            Apply to All
          </Button>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
