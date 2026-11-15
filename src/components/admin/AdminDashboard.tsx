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
import { isSupabaseConfigured } from '../../utils/supabase';
import { MountainLogo } from '../common/MountainLogo';
import { ThemeToggle } from '../common/ThemeToggle';

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
  const [editingNotesId, setEditingNotesId] = useState<string | number | null>(null);
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
  const handleUpdateQueryStatus = async (id: string | number, status: string) => {
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
  const handleSaveQueryNotes = async (id: string | number) => {
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
  const handleDeleteQuery = async (id: string | number) => {
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
  const handleUpdateReviewStatus = async (id: string | number, status: 'approved' | 'rejected') => {
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
  const handleDeleteReview = async (id: string | number) => {
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
  const handleUpdateFeedback = async (id: string | number, status: string) => {
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
  const handleDeleteFeedback = async (id: string | number) => {
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
    setImageTitle(img.title || '');
    setImageCategory(img.category || 'Weddings');
    setImageLocation(img.location || 'Dehradun Valley');
    setImageUrl(img.image_url || img.image || '');
    setImageAspect(img.aspect || 'landscape');
    setImageCaption(img.caption || img.description || '');
    setImageFeatured(img.is_featured === 1);
    setImageOrder(img.display_order || 0);
    setIsAddImageOpen(true);
  };

  // Handle Delete Gallery Image
  const handleDeleteGalleryImage = async (id: string | number, storagePath?: string) => {
    if (!window.confirm(`Delete gallery image #${id}?`)) return;
    try {
      await api.gallery.delete(id, storagePath);
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

  const handleLogoutClick = async () => {
    try {
      await api.admin.logout();
    } catch (e) {
      console.warn('Logout error', e);
    }
    removeAuthToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#F5E6D6]/40 dark:bg-[#062F26] text-[#202522] dark:text-[#FFF3E5] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Admin Bar */}
      <header className="bg-pahad-green-dark dark:bg-[#042720] text-[#FFF0E1] border-b border-pahad-gold/30 dark:border-[#D9B477]/25 py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-md">
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
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
              isSupabaseConfigured()
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">{isSupabaseConfigured() ? 'Supabase Live' : 'Local SQLite'}</span>
            </span>

            <ThemeToggle />

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
                  ? 'bg-white dark:bg-[#0B4636] border-pahad-green dark:border-[#D9B477] shadow-premium ring-1 ring-pahad-green dark:ring-[#D9B477]'
                  : 'bg-white/80 dark:bg-[#083D30] border-[#D9BB87]/40 dark:border-[#D9B477]/20 hover:bg-white dark:hover:bg-[#0B4636]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">Client Inquiries</span>
                <span className="p-1.5 rounded-lg bg-pahad-green/10 dark:bg-[#0B4636] text-pahad-green dark:text-[#D9B477]">
                  <MessageSquare className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#D9B477]">{stats.queries.total}</span>
                {stats.queries.new > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {stats.queries.new} new
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('reviews')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-[#0B4636] border-pahad-green dark:border-[#D9B477] shadow-premium ring-1 ring-pahad-green dark:ring-[#D9B477]'
                  : 'bg-white/80 dark:bg-[#083D30] border-[#D9BB87]/40 dark:border-[#D9B477]/20 hover:bg-white dark:hover:bg-[#0B4636]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">Reviews</span>
                <span className="p-1.5 rounded-lg bg-pahad-gold/20 dark:bg-[#D9B477]/20 text-pahad-gold-dark dark:text-[#D9B477]">
                  <Star className="w-4 h-4 fill-current" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#D9B477]">{stats.reviews.approved}</span>
                {stats.reviews.pending > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {stats.reviews.pending} pending
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('feedback')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'feedback'
                  ? 'bg-white dark:bg-[#0B4636] border-pahad-green dark:border-[#D9B477] shadow-premium ring-1 ring-pahad-green dark:ring-[#D9B477]'
                  : 'bg-white/80 dark:bg-[#083D30] border-[#D9BB87]/40 dark:border-[#D9B477]/20 hover:bg-white dark:hover:bg-[#0B4636]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">Feedback</span>
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  <MessageSquareQuote className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#D9B477]">{stats.feedback.total}</span>
                {stats.feedback.new > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    {stats.feedback.new} unread
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('gallery')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white dark:bg-[#0B4636] border-pahad-green dark:border-[#D9B477] shadow-premium ring-1 ring-pahad-green dark:ring-[#D9B477]'
                  : 'bg-white/80 dark:bg-[#083D30] border-[#D9BB87]/40 dark:border-[#D9B477]/20 hover:bg-white dark:hover:bg-[#0B4636]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">Gallery Photos</span>
                <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                  <ImageIcon className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#D9B477]">{stats.gallery.total}</span>
                <span className="text-[10px] text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 font-medium">published</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#D9BB87]/30 dark:border-[#D9B477]/20">
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'queries'
                ? 'bg-pahad-green dark:bg-[#043C2E] text-[#FFF0E1] border border-pahad-gold/40 shadow-subtle'
                : 'bg-white/80 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] hover:bg-white dark:hover:bg-[#0B4636] border border-[#D9BB87]/30 dark:border-[#D9B477]/20'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Inquiries ({queries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-pahad-green dark:bg-[#043C2E] text-[#FFF0E1] border border-pahad-gold/40 shadow-subtle'
                : 'bg-white/80 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] hover:bg-white dark:hover:bg-[#0B4636] border border-[#D9BB87]/30 dark:border-[#D9B477]/20'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-pahad-green dark:bg-[#043C2E] text-[#FFF0E1] border border-pahad-gold/40 shadow-subtle'
                : 'bg-white/80 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] hover:bg-white dark:hover:bg-[#0B4636] border border-[#D9BB87]/30 dark:border-[#D9B477]/20'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Feedback ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-pahad-green dark:bg-[#043C2E] text-[#FFF0E1] border border-pahad-gold/40 shadow-subtle'
                : 'bg-white/80 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] hover:bg-white dark:hover:bg-[#0B4636] border border-[#D9BB87]/30 dark:border-[#D9B477]/20'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-pahad-green dark:bg-[#043C2E] text-[#FFF0E1] border border-pahad-gold/40 shadow-subtle'
                : 'bg-white/80 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] hover:bg-white dark:hover:bg-[#0B4636] border border-[#D9BB87]/30 dark:border-[#D9B477]/20'
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#083D30] p-4 rounded-2xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setQueryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                      queryStatusFilter === st
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] dark:bg-[#0B4636] text-pahad-charcoal/80 dark:text-[#FFF3E5]/80 hover:bg-[#879B86]/20 dark:hover:bg-[#0E5240]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-pahad-charcoal/40 dark:text-[#FFF3E5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadQueries()}
                  placeholder="Search name, phone, city..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-[#D9BB87]/40 dark:border-[#D9B477]/30 bg-[#FBF6F0]/60 dark:bg-[#0B4636] text-pahad-charcoal dark:text-[#FFF3E5] placeholder:text-pahad-charcoal/40 dark:placeholder:text-[#FFF3E5]/40 focus:outline-none focus:ring-1 focus:ring-pahad-green dark:focus:ring-pahad-gold"
                />
              </div>
            </div>

            {/* Queries List */}
            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">Loading inquiries...</div>
            ) : queries.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#083D30] rounded-3xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 p-8">
                <MessageSquare className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green dark:text-[#FFF3E5]">No inquiries found</h4>
                <p className="text-xs text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">No client submissions match your current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {queries.map((q) => {
                  const phoneDigits = (q.phone || '').replace(/\D/g, '');
                  const clientName = q.name || q.customer_name || 'Client';
                  const eventType = q.event_type || 'your event';
                  const waUrl = `https://wa.me/${phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits}?text=Hello%20${encodeURIComponent(clientName)},%20this%20is%20PAHAD.co%20event%20management%20desk%20in%20Dehradun%20regarding%20your%20inquiry%20for%20${encodeURIComponent(eventType)}.`;

                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-[#0B4636] rounded-2xl p-5 sm:p-6 border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-subtle flex flex-col justify-between space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9BB87]/20 dark:border-[#D9B477]/20 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-pahad-charcoal/50 dark:text-[#FFF3E5]/50">#{q.id}</span>
                          <h3 className="font-serif font-bold text-lg text-pahad-green dark:text-[#FFF3E5]">{q.name}</h3>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pahad-green/10 dark:bg-[#083D30] text-pahad-green dark:text-[#D9B477]">
                            {q.event_type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">
                            {new Date(q.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          
                          {/* Status Picker */}
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQueryStatus(q.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D9BB87]/60 dark:border-[#D9B477]/30 bg-[#FBF6F0] dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                          >
                            <option value="new" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">New</option>
                            <option value="contacted" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Contacted</option>
                            <option value="in_progress" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">In Progress</option>
                            <option value="completed" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Completed</option>
                            <option value="archived" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Query Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30]/60 p-3.5 rounded-xl border border-[#D9BB87]/25 dark:border-[#D9B477]/20">
                        <div>
                          <span className="text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 block font-medium">Contact:</span>
                          <span className="font-semibold text-pahad-charcoal dark:text-[#FFF3E5]">{q.phone}</span>
                          <span className="block text-[11px] text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">{q.email}</span>
                        </div>
                        <div>
                          <span className="text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 block font-medium">Target Date & Location:</span>
                          <span className="font-semibold text-pahad-green dark:text-[#D9B477]">{q.preferred_date}</span>
                          <span className="block text-[11px] text-pahad-charcoal/80 dark:text-[#FFF3E5]/80">{q.event_location}</span>
                        </div>
                        <div>
                          <span className="text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 block font-medium">Estimated Budget:</span>
                          <span className="font-bold text-pahad-gold-dark dark:text-[#D9B477]">{q.estimated_budget || 'Not specified'}</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="text-xs sm:text-sm text-pahad-charcoal/85 dark:text-[#FFF3E5]/90 leading-relaxed bg-white dark:bg-[#062F26] p-3 rounded-lg border border-[#D9BB87]/20 dark:border-[#D9B477]/20">
                        <strong className="text-pahad-green dark:text-[#D9B477] font-semibold">Requirements: </strong>
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
                              className="w-full text-xs p-2.5 rounded-xl border border-[#D9BB87]/60 dark:border-[#D9B477]/30 bg-[#FBF6F0] dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none focus:ring-1 focus:ring-pahad-green"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#FFF3E5]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveQueryNotes(q.id)}
                                className="px-3 py-1 text-xs font-semibold rounded-full bg-pahad-green dark:bg-[#043C2E] border border-pahad-gold/40 text-white"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">
                            <span>
                              <strong className="text-pahad-green dark:text-[#D9B477]">Admin Note:</strong>{' '}
                              {q.admin_notes || <em className="text-pahad-charcoal/40 dark:text-[#FFF3E5]/40">No internal notes yet</em>}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNotesId(q.id);
                                setNotesDraft(q.admin_notes || '');
                              }}
                              className="text-pahad-green dark:text-[#D9B477] hover:underline flex items-center gap-1 font-medium"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{q.admin_notes ? 'Edit' : 'Add Note'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-3 border-t border-[#D9BB87]/20 dark:border-[#D9B477]/20 flex flex-wrap items-center justify-between gap-3">
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pahad-green/10 dark:bg-[#083D30] text-pahad-green dark:text-[#FFF3E5] text-xs font-semibold hover:bg-pahad-green/20 dark:hover:bg-[#0E5240] transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>

                          <a
                            href={`mailto:${q.email}?subject=${encodeURIComponent(`PAHAD.co: Your ${q.event_type} Inquiry`)}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pahad-green/10 dark:bg-[#083D30] text-pahad-green dark:text-[#FFF3E5] text-xs font-semibold hover:bg-pahad-green/20 dark:hover:bg-[#0E5240] transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </a>
                        </div>

                        <button
                          onClick={() => handleDeleteQuery(q.id)}
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 transition-colors p-1"
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
            <div className="flex items-center justify-between bg-white dark:bg-[#083D30] p-4 rounded-2xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25">
              <div className="flex items-center gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                      reviewStatusFilter === st
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] dark:bg-[#0B4636] text-pahad-charcoal/80 dark:text-[#FFF3E5]/80 hover:bg-[#879B86]/20 dark:hover:bg-[#0E5240]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={loadReviews}
                className="text-xs text-pahad-green dark:text-[#D9B477] flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#083D30] rounded-3xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 p-8">
                <Star className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green dark:text-[#FFF3E5]">No reviews found</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-[#0B4636] rounded-2xl p-6 border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-subtle flex flex-col justify-between space-y-4"
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
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                              : r.status === 'rejected'
                              ? 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-pahad-charcoal/85 dark:text-[#FFF3E5]/90 italic leading-relaxed mb-4">
                        “{r.review_text}”
                      </p>

                      <div className="text-xs">
                        <strong className="text-pahad-green dark:text-[#FFF3E5] font-serif text-sm block">{r.name}</strong>
                        <span className="text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">{r.event_type} • {r.event_location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#D9BB87]/20 dark:border-[#D9B477]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'approved')}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'rejected')}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 p-1 transition-colors"
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
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#083D30] p-4 rounded-2xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'Service Quality', 'Planning & Coordination', 'Catering & Hospitality', 'Decor & Ambience', 'Staff & Management', 'General'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedbackCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      feedbackCategoryFilter === cat
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] dark:bg-[#0B4636] text-pahad-charcoal/80 dark:text-[#FFF3E5]/80 hover:bg-[#879B86]/20 dark:hover:bg-[#0E5240]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">Loading feedback...</div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#083D30] rounded-3xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 p-8">
                <MessageSquareQuote className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green dark:text-[#FFF3E5]">No feedback records found</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white dark:bg-[#0B4636] rounded-2xl p-5 border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-xs flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-base text-pahad-green dark:text-[#FFF3E5]">{f.name}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#879B86]/20 dark:bg-[#083D30] text-pahad-green dark:text-[#D9B477] font-medium">
                          {f.category}
                        </span>
                        <div className="flex text-pahad-gold">
                          {Array.from({ length: f.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-pahad-charcoal/85 dark:text-[#FFF3E5]/90 leading-relaxed bg-[#FBF6F0]/60 dark:bg-[#083D30]/60 p-3 rounded-xl border border-[#D9BB87]/20 dark:border-[#D9B477]/20">
                        {f.message}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">
                        <span>Contact: <strong className="text-pahad-charcoal dark:text-[#FFF3E5]">{f.contact}</strong></span>
                        <span>Received: {new Date(f.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-t sm:border-t-0 sm:border-l border-[#D9BB87]/20 dark:border-[#D9B477]/20 pt-3 sm:pt-0 sm:pl-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          f.status === 'reviewed' ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300' : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {f.status}
                      </span>

                      {f.status !== 'reviewed' && (
                        <button
                          onClick={() => handleUpdateFeedback(f.id, 'reviewed')}
                          className="text-xs font-semibold text-pahad-green dark:text-[#D9B477] hover:underline"
                        >
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteFeedback(f.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
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
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#083D30] p-4 rounded-2xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25">
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Weddings', 'Ceremonies', 'Corporate', 'Dinners', 'Birthdays'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      galleryCategoryFilter === cat
                        ? 'bg-pahad-green text-[#FFF0E1]'
                        : 'bg-[#FBF6F0] dark:bg-[#0B4636] text-pahad-charcoal/80 dark:text-[#FFF3E5]/80 hover:bg-[#879B86]/20 dark:hover:bg-[#0E5240]'
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pahad-green dark:bg-[#043C2E] border border-pahad-gold/40 text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
              >
                <Plus className="w-4 h-4 text-pahad-gold" />
                <span>Upload / Add Photograph</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-pahad-charcoal/60 dark:text-[#FFF3E5]/60">Loading gallery portfolio...</div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#083D30] rounded-3xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 p-8">
                <ImageIcon className="w-10 h-10 text-pahad-gold mx-auto mb-2 opacity-50" />
                <h4 className="font-serif font-bold text-lg text-pahad-green dark:text-[#FFF3E5]">No images in category</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white dark:bg-[#0B4636] rounded-2xl overflow-hidden border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-subtle flex flex-col justify-between group"
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
                        <h4 className="font-serif font-bold text-sm text-pahad-green dark:text-[#FFF3E5] line-clamp-1 mb-1">
                          {img.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 mb-2">
                          <MapPin className="w-3 h-3 text-pahad-gold" />
                          <span>{img.location}</span>
                        </div>
                        {img.caption && (
                          <p className="text-[11px] text-pahad-charcoal/70 dark:text-[#FFF3E5]/70 line-clamp-2 italic">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FBF6F0] dark:bg-[#083D30] border-t border-[#D9BB87]/20 dark:border-[#D9B477]/20 flex items-center justify-between text-xs">
                      <button
                        onClick={() => openEditGalleryModal(img)}
                        className="text-pahad-green dark:text-[#D9B477] hover:underline flex items-center gap-1 font-medium"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteGalleryImage(img.id, img.storage_path)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
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
          <div className="max-w-xl mx-auto bg-white dark:bg-[#0B4636] p-6 sm:p-8 rounded-3xl border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-premium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pahad-green/10 dark:bg-[#083D30] flex items-center justify-center text-pahad-green dark:text-[#D9B477]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-pahad-green dark:text-[#FFF3E5]">Security & Password</h3>
                <p className="text-xs text-pahad-charcoal/70 dark:text-[#FFF3E5]/70">Update password for admin account "{currentUser.username}"</p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.isError
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                }`}
              >
                {passwordMsg.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs sm:text-sm bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none focus:ring-2 focus:ring-pahad-green dark:focus:ring-pahad-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1.5">
                  New Password (at least 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs sm:text-sm bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none focus:ring-2 focus:ring-pahad-green dark:focus:ring-pahad-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-pahad-green dark:bg-[#043C2E] border border-pahad-gold/40 text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
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
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B4636] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={resetGalleryForm}
              className="absolute top-5 right-5 p-2 rounded-full bg-pahad-cream dark:bg-[#083D30] hover:bg-[#879B86]/20 text-pahad-charcoal dark:text-[#FFF3E5]"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-pahad-green dark:text-[#FFF3E5] mb-1">
              {editingImage ? 'Edit Photograph Metadata' : 'Add New Gallery Photograph'}
            </h3>
            <p className="text-xs text-pahad-charcoal/70 dark:text-[#FFF3E5]/70 mb-5">
              Add photographs to the website's live portfolio. Supports direct URLs or local file uploads.
            </p>

            <form onSubmit={handleSaveGalleryImage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="e.g. Sunset Mandap at Mussoorie Ridge"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs sm:text-sm bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none focus:ring-2 focus:ring-pahad-green dark:focus:ring-pahad-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={imageCategory}
                    onChange={(e) => setImageCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                  >
                    <option value="Weddings" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Weddings</option>
                    <option value="Ceremonies" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Ceremonies</option>
                    <option value="Corporate" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Corporate</option>
                    <option value="Dinners" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Dinners</option>
                    <option value="Birthdays" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Birthdays</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={imageLocation}
                    onChange={(e) => setImageLocation(e.target.value)}
                    placeholder="e.g. Mussoorie / Rishikesh"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Source (URL or File Upload) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /hero-wedding.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                />
                {!editingImage && (
                  <div className="mt-2">
                    <span className="text-[11px] text-pahad-charcoal/60 dark:text-[#FFF3E5]/60 block mb-1">Or upload image file:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="text-xs text-pahad-charcoal dark:text-[#FFF3E5] file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pahad-green/10 dark:file:bg-[#083D30] file:text-pahad-green dark:file:text-[#D9B477]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageAspect}
                    onChange={(e) => setImageAspect(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                  >
                    <option value="landscape" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Landscape (Wide)</option>
                    <option value="portrait" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Portrait (Tall)</option>
                    <option value="square" className="bg-white dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5]">Square</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={imageOrder}
                    onChange={(e) => setImageOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#D9B477] mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Optional details regarding lighting, decor floral work..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-xs bg-[#FBF6F0]/60 dark:bg-[#083D30] text-pahad-charcoal dark:text-[#FFF3E5] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={resetGalleryForm}
                  className="flex-1 py-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#FFF3E5] text-xs font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-pahad-green dark:bg-[#043C2E] border border-pahad-gold/40 text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
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
