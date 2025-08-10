import React, { useEffect } from 'react';

interface HomeProps {
  onGoToList: () => void;
  onGoToReport: () => void;
}

const Home: React.FC<HomeProps> = ({ onGoToList, onGoToReport }) => {
  useEffect(() => {
    // Simple intersection observer for reveal animation
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const heroBg = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop'; // Placeholder; replace with Addis image

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-200">
        <img src={heroBg} alt="Addis Ababa" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative px-6 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in">FindMeNow</h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg md:text-xl text-gray-100 animate-fade-up">
            A humanitarian platform helping families locate missing loved ones in Ethiopia and around the world. Share information quickly, organize efforts, and bring hope.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 animate-fade-up">
            <button onClick={onGoToList} className="px-6 py-3 rounded-md btn-primary shadow card-hover">Browse Reports</button>
            <button onClick={onGoToReport} className="px-6 py-3 rounded-md bg-white/90 text-gray-900 hover:bg-white shadow card-hover">Report Missing Person</button>
          </div>
        </div>
      </section>

      {/* Impact / Info */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 reveal">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why this matters</h2>
          <p className="text-gray-600 leading-relaxed">
            In Ethiopia, families and communities are deeply connected. When someone goes missing — whether in Addis Ababa, regional towns, or abroad — every minute is crucial. FindMeNow gives people a central place to report, verify, and spread awareness quickly.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 reveal">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• <span className="font-medium text-gray-800">Report Missing</span>: Create a detailed report with photo, last seen location, and date.</li>
            <li>• <span className="font-medium text-gray-800">View Reports</span>: Search and filter confirmed missing persons.</li>
            <li>• <span className="font-medium text-gray-800">Help Others</span>: Share reports, add sightings or tips via comments.</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 reveal">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What you can do</h2>
          <p className="text-gray-600">Share verified information responsibly, volunteer to spread reports in your area, and stay connected. Together, we can bring them home.</p>
          <button onClick={onGoToReport} className="mt-4 px-5 py-2 rounded-md btn-primary">Report Now</button>
        </div>
      </section>
    </div>
  );
};

export default Home; 