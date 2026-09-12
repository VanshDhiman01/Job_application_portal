import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './utils/toast';
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { MyApplications } from './pages/MyApplications';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative z-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url("/desk-bg.png")' }}>
        <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[2px] -z-10" />
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<MyApplications />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
