import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  onGoToList: () => void;
  onGoToReport: () => void;
}

const Home: React.FC<HomeProps> = ({ onGoToList, onGoToReport }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const heroBg = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';
  const merkatoBg = 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2000&auto=format&fit=crop';
  const reunionImg = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop';
  const latest = [
    { id: '1', name: 'Abel T.', lastSeen: '2025-05-12', location: 'Addis Ababa, Merkato', photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop' },
    { id: '2', name: 'Hana M.', lastSeen: '2025-06-02', location: 'Bole, Addis Ababa', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=600&auto=format&fit=crop' },
    { id: '3', name: 'Samuel K.', lastSeen: '2025-05-28', location: 'Piazza, Addis Ababa', photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop' },
    { id: '4', name: 'Lulit S.', lastSeen: '2025-06-10', location: 'Arat Kilo, Addis Ababa', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Hero – keep as is */}
      <section className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-sm border border-gray-200">
        <img src={heroBg} alt="Addis Ababa" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative px-4 sm:px-6 md:px-8 py-14 md:py-20 text-center text-white">
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

      {/* New Merkato Impact Section */}
      <section className="relative rounded-xl md:rounded-2xl overflow-hidden border border-gray-200">
        <img src={merkatoBg} alt="Merkato crowd (replace with real Ethiopian market image)" className="absolute inset-0 w-full h-full object-cover blur-sm" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative px-4 sm:px-6 md:px-8 py-10 md:py-14 text-white">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-center">
            Every missing person is a family waiting, a community searching
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-3 max-w-3xl mx-auto text-center text-gray-200">
            In places like Merkato, Addis Ababa — where thousands pass each hour — quick, credible information can save lives.
          </motion.p>

          {/* Animated statistics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[{ label: 'Reports / Year', value: 1200 }, { label: 'Verified Leads', value: 540 }, { label: 'Communities Reached', value: 75 }, { label: 'Reunions', value: 210 }].map((s, idx) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/10 rounded-lg p-4 text-center">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
                  className="text-3xl md:text-4xl font-extrabold">
                  {s.value.toLocaleString()}
                </motion.div>
                <div className="text-sm md:text-base text-gray-200">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Missing Persons – Auto-scrolling carousel */}
      <section className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">Latest Missing Persons</h3>
          <button onClick={onGoToList} className="text-sm text-brand hover:underline">View all</button>
        </div>
        <div className="group overflow-hidden">
          <div className="flex gap-4 carousel-track">
            {[...latest, ...latest].map((item) => (
              <div key={`${item.id}-${Math.random()}`} className="w-56 md:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg md:rounded-xl shadow border overflow-hidden card-hover hover:scale-[1.02]">
                  <img src={item.photo} alt={`${item.name} (replace with real Ethiopian street/crowd portrait if possible)`} className="w-full h-36 md:h-40 object-cover" />
                  <div className="p-3">
                    <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                    <div className="text-sm text-gray-600 truncate">Last seen: {item.lastSeen}</div>
                    <div className="text-xs text-gray-500 truncate">{item.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works – 5 steps */}
      <section className="rounded-xl md:rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #003049 0%, #1f2937 100%)' }}>
        <div className="px-4 sm:px-6 md:px-8 py-10 md:py-14 text-white">
          <h3 className="text-2xl md:text-3xl font-extrabold text-center">How It Works</h3>
          <p className="text-center mt-2 text-gray-200">Five coordinated steps to move fast and stay credible.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'Report', desc: 'Submit details and a clear photo.' },
              { title: 'Verify', desc: 'Moderators review for accuracy.' },
              { title: 'Notify Police', desc: 'Coordinate with local authorities.' },
              { title: 'Share', desc: 'Amplify across communities & platforms.' },
              { title: 'Find', desc: 'Track tips and leads to reunite.' },
            ].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }}
                className="bg-white/10 rounded-lg p-4 text-center">
                <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-white/20 grid place-items-center text-white font-bold">{i + 1}</div>
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm text-gray-200 mt-1">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial – reunion */}
      <section className="rounded-xl md:rounded-2xl overflow-hidden bg-[#F77F00]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img src={reunionImg} alt="Reunion (replace with Ethiopian reunion image)" className="w-full h-64 md:h-full object-cover" />
          <div className="p-6 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-extrabold">“After weeks of searching, a single verified tip led us to our brother.”</h3>
            <p className="mt-3 text-white/90">Thanks to hundreds who shared and the quick coordination with local police, our family is together again. Your effort matters.</p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="rounded-xl md:rounded-2xl overflow-hidden bg-[#D72638] text-white">
        <div className="px-4 sm:px-6 md:px-8 py-10 md:py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold">See something? Say something.</h3>
          <p className="mt-2 text-white/90">Report missing persons quickly. Moderation helps keep information credible and effective.</p>
          <div className="mt-5">
            <button onClick={onGoToReport} className="px-6 py-3 bg-white text-[#D72638] rounded-md font-semibold hover:bg-gray-100">Report Missing Person Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 