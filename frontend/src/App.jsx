import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<div>Home – Smart Campus Hub</div>} />
        {/* Member 1 adds: <Route path="/resources" element={<ResourcesPage />} /> */}
        {/* Member 2 adds: <Route path="/bookings" element={<BookingsPage />} /> */}
        {/* Member 3 adds: <Route path="/tickets" element={<TicketsPage />} /> */}
        {/* Member 4 adds: <Route path="/notifications" element={<NotificationsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;