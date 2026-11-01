import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  MessageSquare, 
  Star, 
  MessageSquareQuote, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  RefreshCw, 
  Search, 
  Plus, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  KeyRound, 
  Home,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  ClientQueryItem, 
  CustomerReview, 
  FeedbackItem, 
  GalleryImageItem, 
  AdminStats, 
  AdminUser 
} from '../../types';
import { api, removeAuthToken } from '../../utils/api';
import { MountainLogo } from '../common/MountainLogo';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onBackToSite
}) => {
  const [activeTab, setActiveTab] = useState<'queries' | 'reviews' | 'feedback' | 'gallery' | 'settings'>('queries');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Queries State
  const [queries, setQueries] = useState<ClientQueryItem[]>([]);
  const [queryStatusFilter, setQueryStatusFilter] = useState('all');
  const [querySearch, setQuerySearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImageItem | null>(null);

  // Gallery Form State
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('Weddings');
  const [imageLocation, setImageLocation] = useState('Dehradun Valley');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAspect, setImageAspect] = useState<'landscape' | 'portrait' | 'square'>('landscape');
  const [imageCaption, setImageCaption] = useState('');
  const [imageFeatured, setImageFeatured] = useState(false);
  const [imageOrder, setImageOrder] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Load KPI Stats
  const loadStats = async () => {
    try {
      const res = await api.admin.getStats();
      if (res && res.stats) setStats(res.stats);
    } catch (err) {
      console.warn('Failed to load admin stats', err);
    }
  };

  // Load Queries
  const loadQueries = async () => {
    setLoading(true);
    try {
      const res = await api.queries.getAll({
        status: queryStatusFilter !== 'all' ? queryStatusFilter : undefined,
        search: querySearch.trim() || undefined
      });
      if (res && res.data) setQueries(res.data);
    } catch (err) {
      console.warn('Failed to load queries', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Reviews
  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.reviews.getAll(reviewStatusFilter !== 'all' ? reviewStatusFilter : undefined);
      if (res && res.data) setReviews(res.data);
    } catch (err) {
      console.warn('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Feedback
  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.feedback.getAll({
        category: feedbackCategoryFilter !== 'all' ? feedbackCategoryFilter : undefined
      });
      if (res && res.data) setFeedbacks(res.data);
    } catch (err) {
      console.warn('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Gallery
  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await api.gallery.getAll(galleryCategoryFilter !== 'All' ? galleryCategoryFilter : undefined);
      if (res && res.data) setGalleryImages(res.data);
    } catch (err) {
      console.warn('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    if (activeTab === 'queries') loadQueries();
    else if (activeTab === 'reviews') loadReviews();
    else if (activeTab === 'feedback') loadFeedback();
    else if (activeTab === 'gallery') loadGallery();
  }, [activeTab, queryStatusFilter, reviewStatusFilter, feedbackCategoryFilter, galleryCategoryFilter]);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Handle Query status change
  const handleUpdateQueryStatus = async (id: number, status: string) => {
    try {
      await api.queries.update(id, { status });
      showNotification(`Query #${id} status changed to ${status}`);
      loadQueries();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update query');
    }
  };

  // Handle Save Query Admin Notes
  const handleSaveQueryNotes = async (id: number) => {
    try {
      await api.queries.update(id, { adminNotes: notesDraft });
      setEditingNotesId(null);
      showNotification(`Notes saved for Query #${id}`);
      loadQueries();
    } catch (err: any) {
      alert(err.message || 'Failed to save notes');
    }
  };

  // Handle Delete Query
  const handleDeleteQuery = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete inquiry #${id}?`)) return;
    try {
      await api.queries.delete(id);
      showNotification(`Query #${id} removed.`);
      loadQueries();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete query');
    }
  };

  // Handle Review Status
  const handleUpdateReviewStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.reviews.updateStatus(id, status);
      showNotification(`Review #${id} ${status}!`);
      loadReviews();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update review');
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (id: number) => {
    if (!window.confirm(`Delete review #${id}?`)) return;
    try {
      await api.reviews.delete(id);
      showNotification(`Review #${id} deleted.`);
      loadReviews();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  // Handle Feedback Update
  const handleUpdateFeedback = async (id: number, status: string) => {
    try {
      await api.feedback.update(id, { status });
      showNotification(`Feedback #${id} marked as ${status}.`);
      loadFeedback();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update feedback');
    }
  };

  // Handle Delete Feedback
  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm(`Delete feedback #${id}?`)) return;
    try {
      await api.feedback.delete(id);
      showNotification(`Feedback #${id} removed.`);
      loadFeedback();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete feedback');
    }
  };

  // Reset Gallery Form
  const resetGalleryForm = () => {
    setImageTitle('');
    setImageCategory('Weddings');
    setImageLocation('Dehradun Valley');
    setImageUrl('');
    setImageAspect('landscape');
    setImageCaption('');
    setImageFeatured(false);
    setImageOrder(0);
    setSelectedFile(null);
    setEditingImage(null);
    setIsAddImageOpen(false);
  };

  // Handle Save Gallery Image (Add or Edit)
  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageTitle.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      if (editingImage) {
        // Update
        await api.gallery.update(editingImage.id, {
          title: imageTitle.trim(),
          category: imageCategory,
          location: imageLocation.trim(),
          image_url: imageUrl.trim() || editingImage.image_url,
          aspect: imageAspect,
          caption: imageCaption.trim(),
          is_featured: imageFeatured ? 1 : 0,
          display_order: Number(imageOrder)
        });
        showNotification('Gallery image updated successfully.');
      } else {
        // Add
        if (selectedFile) {
          const formData = new FormData();
          formData.append('imageFile', selectedFile);
          formData.append('title', imageTitle.trim());
          formData.append('category', imageCategory);
          formData.append('location', imageLocation.trim());
          formData.append('aspect', imageAspect);
          formData.append('caption', imageCaption.trim());
          formData.append('isFeatured', imageFeatured ? 'true' : 'false');
          formData.append('displayOrder', String(imageOrder));
          await api.gallery.add(formData);
        } else {
          if (!imageUrl.trim()) {
            alert('Please provide an image URL or choose a file to upload.');
            return;
          }
          await api.gallery.add({
            title: imageTitle.trim(),
            category: imageCategory,
            location: imageLocation.trim(),
            imageUrl: imageUrl.trim(),
            aspect: imageAspect,
            caption: imageCaption.trim(),
            isFeatured: imageFeatured,
            displayOrder: Number(imageOrder)
          });
        }
        showNotification('New gallery image published.');
      }

      resetGalleryForm();
      loadGallery();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to save gallery image');
    }
  };

  // Open Edit Gallery Modal
  const openEditGalleryModal = (img: GalleryImageItem) => {
    setEditingImage(img);
    setImageTitle(img.title);
    setImageCategory(img.category);
    setImageLocation(img.location);
    setImageUrl(img.image_url);
    setImageAspect(img.aspect);
    setImageCaption(img.caption || '');
    setImageFeatured(img.is_featured === 1);
    setImageOrder(img.display_order || 0);
    setIsAddImageOpen(true);
  };

  // Handle Delete Gallery Image
  const handleDeleteGalleryImage = async (id: number) => {
    if (!window.confirm(`Delete gallery image #${id}?`)) return;
    try {
      await api.gallery.delete(id);
      showNotification(`Image #${id} deleted.`);
      loadGallery();
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const res = await api.admin.changePassword(currentPassword, newPassword);
      setPasswordMsg({ text: res.message || 'Password changed successfully.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Failed to change password.', isError: true });
    }
  };

  const handleLogoutClick = () => {
    removeAuthToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#F5E6D6]/40 text-[#202522] flex flex-col font-sans">
      
      {/* Top Admin Bar */}
      <header className="bg-pahad-green-dark text-[#FFF0E1] border-b border-pahad-gold/30 py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MountainLogo variant="light" size="sm" showSubtitle={false} />
            <div className="hidden sm:block border-l border-[#FFF0E1]/20 pl-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-pahad-gold block">
                ADMIN CONSOLE
              </span>
              <span className="text-[11px] text-[#FFF0E1]/70">
                Logged in as <strong className="text-white">{currentUser.username}</strong> ({currentUser.role})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-[#FFF0E1] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Website</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-xs font-semibold text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {actionMessage && (
        <div className="fixed top-16 right-6 z-50 bg-pahad-green text-[#FFF0E1] px-4 py-2.5 rounded-2xl shadow-2xl border border-pahad-gold text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-pahad-gold" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        
        {/* KPI Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => setActiveTab('queries')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'queries'
                  ? 'bg-white border-pahad-green shadow-premium ring-1 ring-pahad-green'
                  : 'bg-white/80 border-[#D9BB87]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70">Client Inquiries</span>
                <span className="p-1.5 rounded-lg bg-pahad-green/10 text-pahad-green">
                  <MessageSquare className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">{stats.queries.total}</span>
                {stats.queries.new > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {stats.queries.new} new
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('reviews')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white border-pahad-green shadow-premium ring-1 ring-pahad-green'
                  : 'bg-white/80 border-[#D9BB87]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70">Reviews</span>
                <span className="p-1.5 rounded-lg bg-pahad-gold/20 text-pahad-gold-dark">
                  <Star className="w-4 h-4 fill-current" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">{stats.reviews.approved}</span>
                {stats.reviews.pending > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {stats.reviews.pending} pending
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('feedback')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'feedback'
                  ? 'bg-white border-pahad-green shadow-premium ring-1 ring-pahad-green'
                  : 'bg-white/80 border-[#D9BB87]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70">Feedback</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                  <MessageSquareQuote className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">{stats.feedback.total}</span>
                {stats.feedback.new > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {stats.feedback.new} unread
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('gallery')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white border-pahad-green shadow-premium ring-1 ring-pahad-green'
                  : 'bg-white/80 border-[#D9BB87]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70">Gallery Photos</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <ImageIcon className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">{stats.gallery.total}</span>
                <span className="text-[10px] text-pahad-charcoal/60 font-medium">published</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#D9BB87]/30">
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'queries'
                ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                : 'bg-white/80 text-pahad-charcoal hover:bg-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Inquiries ({queries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                : 'bg-white/80 text-pahad-charcoal hover:bg-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                : 'bg-white/80 text-pahad-charcoal hover:bg-white'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Feedback ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                : 'bg-white/80 text-pahad-charcoal hover:bg-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                : 'bg-white/80 text-pahad-charcoal hover:bg-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Admin Settings</span>
          </button>
        </div>

        {/* TAB 1: CLIENT INQUIRIES */}
        {activeTab === 'queries' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9BB87]/40 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setQueryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                      queryStatusFilter === st
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] text-pahad-charcoal/80 hover:bg-[#879B86]/20'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-pahad-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadQueries()}
                  placeholder="Search name, phone, city..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-[#D9BB87]/40 bg-[#FBF6F0]/60 focus:outline-none focus:ring-1 focus:ring-pahad-green"
                />
              </div>
            </div>

            {/* Queries List */}
            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60">Loading inquiries...</div>
            ) : queries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#D9BB87]/40 p-8">
                <MessageSquare className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green">No inquiries found</h4>
                <p className="text-xs text-pahad-charcoal/60">No client submissions match your current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {queries.map((q) => {
                  const phoneDigits = q.phone.replace(/\D/g, '');
                  const waUrl = `https://wa.me/${phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits}?text=Hello%20${encodeURIComponent(q.name)},%20this%20is%20PAHAD.co%20event%20management%20desk%20in%20Dehradun%20regarding%20your%20inquiry%20for%20${encodeURIComponent(q.event_type)}.`;

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D9BB87]/40 shadow-subtle flex flex-col justify-between space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9BB87]/20 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-pahad-charcoal/50">#{q.id}</span>
                          <h3 className="font-serif font-bold text-lg text-pahad-green">{q.name}</h3>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pahad-green/10 text-pahad-green">
                            {q.event_type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-pahad-charcoal/60">
                            {new Date(q.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          
                          {/* Status Picker */}
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQueryStatus(q.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D9BB87]/60 bg-[#FBF6F0] focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Query Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FBF6F0]/60 p-3.5 rounded-xl border border-[#D9BB87]/25">
                        <div>
                          <span className="text-pahad-charcoal/60 block font-medium">Contact:</span>
                          <span className="font-semibold text-pahad-charcoal">{q.phone}</span>
                          <span className="block text-[11px] text-pahad-charcoal/70">{q.email}</span>
                        </div>
                        <div>
                          <span className="text-pahad-charcoal/60 block font-medium">Target Date & Location:</span>
                          <span className="font-semibold text-pahad-green">{q.preferred_date}</span>
                          <span className="block text-[11px] text-pahad-charcoal/80">{q.event_location}</span>
                        </div>
                        <div>
                          <span className="text-pahad-charcoal/60 block font-medium">Estimated Budget:</span>
                          <span className="font-bold text-pahad-gold-dark">{q.estimated_budget || 'Not specified'}</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="text-xs sm:text-sm text-pahad-charcoal/85 leading-relaxed bg-white p-3 rounded-lg border border-[#D9BB87]/20">
                        <strong className="text-pahad-green font-semibold">Requirements: </strong>
                        {q.message}
                      </div>

                      {/* Admin Notes Section */}
                      <div className="pt-2">
                        {editingNotesId === q.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              placeholder="Add internal notes (e.g. quoted 15L, client preferred Kanatal resort)..."
                              className="w-full text-xs p-2.5 rounded-xl border border-[#D9BB87]/60 bg-[#FBF6F0] focus:outline-none focus:ring-1 focus:ring-pahad-green"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveQueryNotes(q.id)}
                                className="px-3 py-1 text-xs font-semibold rounded-full bg-pahad-green text-white"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-pahad-charcoal/70">
                            <span>
                              <strong className="text-pahad-green">Admin Note:</strong>{' '}
                              {q.admin_notes || <em className="text-pahad-charcoal/40">No internal notes yet</em>}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNotesId(q.id);
                                setNotesDraft(q.admin_notes || '');
                              }}
                              className="text-pahad-green hover:underline flex items-center gap-1 font-medium"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{q.admin_notes ? 'Edit' : 'Add Note'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-3 border-t border-[#D9BB87]/20 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
                          >
                            <span>WhatsApp Client</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href={`tel:${q.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pahad-green/10 text-pahad-green text-xs font-semibold hover:bg-pahad-green/20"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>

                          <a
                            href={`mailto:${q.email}?subject=${encodeURIComponent(`PAHAD.co: Your ${q.event_type} Inquiry`)}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pahad-green/10 text-pahad-green text-xs font-semibold hover:bg-pahad-green/20"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </a>
                        </div>

                        <button
                          onClick={() => handleDeleteQuery(q.id)}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors p-1"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#D9BB87]/40">
              <div className="flex items-center gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                      reviewStatusFilter === st
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] text-pahad-charcoal/80 hover:bg-[#879B86]/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={loadReviews}
                className="text-xs text-pahad-green flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#D9BB87]/40 p-8">
                <Star className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green">No reviews found</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-6 border border-[#D9BB87]/40 shadow-subtle flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-pahad-gold">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            r.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-pahad-charcoal/85 italic leading-relaxed mb-4">
                        “{r.review_text}”
                      </p>

                      <div className="text-xs">
                        <strong className="text-pahad-green font-serif text-sm block">{r.name}</strong>
                        <span className="text-pahad-charcoal/60">{r.event_type} • {r.event_location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#D9BB87]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'approved')}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'rejected')}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 p-1"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FEEDBACK SUBMISSIONS */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9BB87]/40">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'Service Quality', 'Planning & Coordination', 'Catering & Hospitality', 'Decor & Ambience', 'Staff & Management', 'General'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedbackCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      feedbackCategoryFilter === cat
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] text-pahad-charcoal/80 hover:bg-[#879B86]/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60">Loading feedback...</div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#D9BB87]/40 p-8">
                <MessageSquareQuote className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green">No feedback records found</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-2xl p-5 border border-[#D9BB87]/40 shadow-xs flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-base text-pahad-green">{f.name}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#879B86]/20 text-pahad-green font-medium">
                          {f.category}
                        </span>
                        <div className="flex text-pahad-gold">
                          {Array.from({ length: f.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-pahad-charcoal/85 leading-relaxed bg-[#FBF6F0]/60 p-3 rounded-xl border border-[#D9BB87]/20">
                        {f.message}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-pahad-charcoal/60">
                        <span>Contact: <strong>{f.contact}</strong></span>
                        <span>Received: {new Date(f.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-t sm:border-t-0 sm:border-l border-[#D9BB87]/20 pt-3 sm:pt-0 sm:pl-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          f.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {f.status}
                      </span>

                      {f.status !== 'reviewed' && (
                        <button
                          onClick={() => handleUpdateFeedback(f.id, 'reviewed')}
                          className="text-xs font-semibold text-pahad-green hover:underline"
                        >
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteFeedback(f.id)}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9BB87]/40">
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Weddings', 'Ceremonies', 'Corporate', 'Dinners', 'Birthdays'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      galleryCategoryFilter === cat
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] text-pahad-charcoal/80 hover:bg-[#879B86]/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  resetGalleryForm();
                  setIsAddImageOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
              >
                <Plus className="w-4 h-4 text-pahad-gold" />
                <span>Upload / Add Photograph</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60">Loading gallery portfolio...</div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#D9BB87]/40 p-8">
                <ImageIcon className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green">No images in category</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#D9BB87]/40 shadow-subtle flex flex-col justify-between group"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-black/10 relative">
                        <img
                          src={img.image_url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                          {img.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-serif font-bold text-sm text-pahad-green line-clamp-1 mb-1">
                          {img.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-pahad-charcoal/60 mb-2">
                          <MapPin className="w-3 h-3 text-pahad-gold" />
                          <span>{img.location}</span>
                        </div>
                        {img.caption && (
                          <p className="text-[11px] text-pahad-charcoal/70 line-clamp-2 italic">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FBF6F0] border-t border-[#D9BB87]/20 flex items-center justify-between text-xs">
                      <button
                        onClick={() => openEditGalleryModal(img)}
                        className="text-pahad-green hover:underline flex items-center gap-1 font-medium"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ADMIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#D9BB87]/40 shadow-premium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pahad-green/10 flex items-center justify-center text-pahad-green">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-pahad-green">Security & Password</h3>
                <p className="text-xs text-pahad-charcoal/70">Update password for admin account "{currentUser.username}"</p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {passwordMsg.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                  New Password (at least 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
                >
                  Update Admin Password
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Gallery Add / Edit Modal */}
      {isAddImageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9BB87]/50 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={resetGalleryForm}
              className="absolute top-5 right-5 p-2 rounded-full bg-pahad-cream hover:bg-[#879B86]/20 text-pahad-charcoal"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-pahad-green mb-1">
              {editingImage ? 'Edit Photograph Metadata' : 'Add New Gallery Photograph'}
            </h3>
            <p className="text-xs text-pahad-charcoal/70 mb-5">
              Add photographs to the website's live portfolio. Supports direct URLs or local file uploads.
            </p>

            <form onSubmit={handleSaveGalleryImage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="e.g. Sunset Mandap at Mussoorie Ridge"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={imageCategory}
                    onChange={(e) => setImageCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Ceremonies">Ceremonies</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Dinners">Dinners</option>
                    <option value="Birthdays">Birthdays</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={imageLocation}
                    onChange={(e) => setImageLocation(e.target.value)}
                    placeholder="e.g. Mussoorie / Rishikesh"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Source (URL or File Upload) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /hero-wedding.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                />
                {!editingImage && (
                  <div className="mt-2">
                    <span className="text-[11px] text-pahad-charcoal/60 block mb-1">Or upload image file:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="text-xs text-pahad-charcoal file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pahad-green/10 file:text-pahad-green"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageAspect}
                    onChange={(e) => setImageAspect(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                  >
                    <option value="landscape">Landscape (Wide)</option>
                    <option value="portrait">Portrait (Tall)</option>
                    <option value="square">Square</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={imageOrder}
                    onChange={(e) => setImageOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Optional details regarding lighting, decor floral work..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 text-xs bg-[#FBF6F0]/60 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={resetGalleryForm}
                  className="flex-1 py-2.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
                >
                  {editingImage ? 'Update Photograph' : 'Publish Photograph'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
