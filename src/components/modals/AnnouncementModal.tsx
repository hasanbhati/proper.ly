import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import useStore from '../../store';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementId?: string;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, announcementId }) => {
  const { announcements, properties, addAnnouncement, updateAnnouncement } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    datePosted: '',
    properties: [] as string[],
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  useEffect(() => {
    if (announcementId) {
      const announcement = announcements.find(a => a.id === announcementId);
      if (announcement) {
        setFormData({
          title: announcement.title,
          content: announcement.content,
          datePosted: announcement.datePosted,
          properties: announcement.properties,
        });
        setSelectedProperties(announcement.properties);
      }
    } else {
      setFormData({
        title: '',
        content: '',
        datePosted: new Date().toISOString().split('T')[0],
        properties: [],
      });
      setSelectedProperties([]);
    }
  }, [announcementId, announcements]);

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const announcementData = {
      ...formData,
      properties: selectedProperties,
      datePosted: formData.datePosted || new Date().toISOString().split('T')[0],
    };
    if (announcementId) {
      updateAnnouncement(announcementId, announcementData);
    } else {
      addAnnouncement({
        id: `ann${Date.now()}`,
        ...announcementData,
      });
    }
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={announcementId ? 'Edit Announcement' : 'Create New Announcement'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Posted</label>
          <input
            type="date"
            value={formData.datePosted}
            onChange={e => setFormData({ ...formData, datePosted: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Applies to Properties</label>
          <div className="grid grid-cols-2 gap-2">
            {properties.map(property => (
              <label key={property.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={property.id}
                  checked={selectedProperties.includes(property.id)}
                  onChange={() => handlePropertyChange(property.id)}
                  className="form-checkbox rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">{property.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            {announcementId ? 'Save Changes' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AnnouncementModal; 