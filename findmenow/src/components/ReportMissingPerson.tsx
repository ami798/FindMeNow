import React, { useState } from 'react';
import type { MissingPersonFormData } from '../types';
import { addMissingPerson } from '../services/dataService';
import { auth } from '../firebase';

interface ReportMissingPersonProps {
  onReportSubmitted: () => void;
}

type FormErrors = {
  fullName?: string;
  lastSeenLocation?: string;
  description?: string;
  photo?: string;
  missingDate?: string;
  contactPhone?: string;
};

const ReportMissingPerson: React.FC<ReportMissingPersonProps> = ({ onReportSubmitted }) => {
  const [formData, setFormData] = useState<MissingPersonFormData>({
    fullName: '',
    lastSeenLocation: '',
    description: '',
    photo: null,
    missingDate: new Date().toISOString().slice(0, 10),
    contactPhone: '',
    features: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const user = auth.currentUser;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.lastSeenLocation.trim()) newErrors.lastSeenLocation = 'Last seen location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (!formData.missingDate) newErrors.missingDate = 'Missing date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      if (errors.photo) setErrors(prev => ({ ...prev, photo: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addMissingPerson(formData);
      setFormData({
        fullName: '',
        lastSeenLocation: '',
        description: '',
        photo: null,
        missingDate: new Date().toISOString().slice(0, 10),
        contactPhone: '',
        features: '',
      });
      setPhotoPreview('');
      setErrors({});
      onReportSubmitted();
      alert('Missing person report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || !user;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Report Missing Person</h2>
      {!user && (
        <p className="mb-4 text-center text-sm text-red-600">Please log in to submit a report.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter full name" />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="missingDate" className="block text-sm font-medium text-gray-700 mb-2">Missing Since *</label>
            <input type="date" id="missingDate" name="missingDate" value={formData.missingDate} onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.missingDate ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.missingDate && <p className="mt-1 text-sm text-red-600">{errors.missingDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lastSeenLocation" className="block text-sm font-medium text-gray-700 mb-2">Last Seen Location *</label>
            <input type="text" id="lastSeenLocation" name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.lastSeenLocation ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter last seen location" />
            {errors.lastSeenLocation && <p className="mt-1 text-sm text-red-600">{errors.lastSeenLocation}</p>}
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="Enter contact phone (optional)" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Age, height, clothing, etc." />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">Distinctive Features</label>
          <input type="text" id="features" name="features" value={formData.features} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="Scars, tattoos, accessories, etc." />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {photoPreview ? (
                <div className="mb-4">
                  <img src={photoPreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                </div>
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a photo</span>
                  <input id="photo" name="photo" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={disabled} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportMissingPerson; 