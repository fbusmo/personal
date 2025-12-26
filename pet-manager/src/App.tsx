import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PetProvider } from './contexts/PetContext';
import { Home } from './pages/Home';
import { PetForm } from './pages/PetForm';
import { PetProfile } from './pages/PetProfile';
import { EventForm } from './pages/EventForm';
import { EventDetail } from './pages/EventDetail';
import { Reminders } from './pages/Reminders';
import { useEffect } from 'react';
import { initializeSettings } from './lib/db';

function App() {
  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <Router>
      <PetProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets/new" element={<PetForm />} />
            <Route path="/pets/:id/edit" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetProfile />} />
            <Route path="/pets/:petId/events/new" element={<EventForm />} />
            <Route path="/pets/:petId/events/:eventId" element={<EventDetail />} />
            <Route path="/reminders" element={<Reminders />} />
          </Routes>
        </div>
      </PetProvider>
    </Router>
  );
}

export default App;
