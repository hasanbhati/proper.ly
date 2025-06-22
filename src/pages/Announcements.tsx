import { BellRing, Plus, Calendar } from 'lucide-react';
import useStore from '../store';
import AnnouncementModal from '../components/modals/AnnouncementModal';

const Announcements: React.FC = () => {
  const { announcements, properties, deleteAnnouncement, isAnnouncementModalOpen, toggleAnnouncementModal, selectedItemId } = useStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        <button
          onClick={() => toggleAnnouncementModal()}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          <Plus size={20} />
          New Announcement
        </button>
      </div>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
            No announcements yet. Create your first announcement!
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                  <p className="text-gray-600 mt-2 break-words">{announcement.content}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(announcement.datePosted).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BellRing size={16} />
                      <span>
                        {announcement.properties.length === properties.length
                          ? 'All Properties'
                          : announcement.properties.map(getPropertyName).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {isAnnouncementModalOpen && (
        <AnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={() => toggleAnnouncementModal()}
          announcementId={selectedItemId || undefined}
        />
      )}
    </div>
  );
};

export default Announcements;