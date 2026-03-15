import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { css } from '../../styled-system/css';

const DashboardLayout = () => {
  return (
    <div className={css({
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'slate.50',
      direction: 'var(--direction, ltr)' // Use a CSS variable for direction if needed
    })}>
      <Sidebar />
      <main className={css({
        flex: 1,
        padding: { base: '16px', md: '32px' },
        overflowY: 'auto',
        height: '100vh'
      })}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
