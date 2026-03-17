import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen relative">
        {/* Ambient background glow for the content area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
