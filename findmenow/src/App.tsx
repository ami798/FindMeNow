import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ReportMissingPerson from './components/ReportMissingPerson';
import MissingList from './components/MissingList';
import SearchBar from './components/SearchBar';
import Home from './components/Home';
import PersonDetailModal from './components/PersonDetailModal';
import type { MissingPerson, SearchFilters } from './types';
import { getMissingPersons } from './services/dataService';

function App() {
  console.log('[FindMeNow] App render start');
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({ query: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'list' | 'report'>('home');
  const [selected, setSelected] = useState<MissingPerson | null>(null);

  useEffect(() => {
    console.log('[FindMeNow] useEffect fetchMissingPersons');
    fetchMissingPersons();
  }, []);

  const fetchMissingPersons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const persons = await getMissingPersons();
      console.log('[FindMeNow] fetched persons', persons.length);
      setMissingPersons(persons);
    } catch (err) {
      setError('Failed to fetch missing person reports. Please try again later.');
      console.error('Error fetching missing persons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSubmitted = () => {
    fetchMissingPersons();
    setActiveTab('list');
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)}>
      {activeTab === 'home' && (
        <Home onGoToList={() => setActiveTab('list')} onGoToReport={() => setActiveTab('report')} />
      )}

      {activeTab === 'list' && (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Missing Persons</h1>
            <p className="text-gray-600 text-center mb-6">Help us find missing persons by searching through reports or submit a new one.</p>
            <SearchBar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading missing person reports...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                    <button onClick={fetchMissingPersons} className="mt-2 text-sm text-red-600 hover:text-red-500 underline">Try again</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <MissingList missingPersons={missingPersons} searchQuery={filters.query} onSelect={setSelected} />
          )}

          <PersonDetailModal person={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {activeTab === 'report' && (
        <div>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Report a Missing Person</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">If you know someone who is missing, please provide as much information as possible. Your report will help our community assist in finding them.</p>
          </div>
          <ReportMissingPerson onReportSubmitted={handleReportSubmitted} />
        </div>
      )}
    </Layout>
  );
}

export default App;
