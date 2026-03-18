import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}