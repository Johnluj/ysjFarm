import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Bird, TrendingUp, Users, LogOut, Bell, Search, Moon, Sun,
  Menu, ChevronRight, Activity, ArrowUpRight, ShoppingBag, AlertCircle,
  Plus, MessageSquare, Send, X, ShieldCheck, UserCheck, UserPlus, ClipboardList,
  Pencil, Trash2, Settings, Wrench, Database
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BirdRecord, SalesRecord, UserProfile, CommentRecord, DailyReport } from '../types';
import { supabase } from '../lib/supabase';
import AuthForms from '../components/admin/AuthForms';

export default function Admin() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Handle Auth
  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session?.user) {
          setCurrentUser(session.user);
          fetchUserProfile(session.user);
        } else {
          setAuthLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setUserProfile(null);
          setAuthLoading(false);
        }
      }
    });

  async function fetchUserProfile(user: any) {
      if (!isMounted) return;
      setAuthLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is code for "no rows returned"
          // If we can't fetch profile due to permissions or missing table, 
          // we should still allow primary admins to proceed
          if (user.email === 'admin@ysjpoultry.com' || user.email === 'admin@ysj.com' || user.email === 'adeagbojohnluj@gmail.com') {
             setUserProfile({
               id: user.id,
               email: user.email,
               name: user.user_metadata?.full_name || 'Main Admin',
               role: 'ADMIN'
             });
             setAuthLoading(false);
             return;
          }
          throw error;
        }

        if (profile) {
          setUserProfile(profile as UserProfile);
        } else {
          // Bootstrap / Invitation logic
          const { data: authorizedStaff } = await supabase
            .from('authorized_staff')
            .select('*')
            .eq('email', user.email)
            .single();

          let newProfile: UserProfile;
          if (user.email === 'admin@ysjpoultry.com' || user.email === 'admin@ysj.com' || user.email === 'adeagbojohnluj@gmail.com') {
            newProfile = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || 'Admin',
              role: 'ADMIN'
            };
          } else if (authorizedStaff) {
            newProfile = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || authorizedStaff.name || 'Staff',
              role: authorizedStaff.role
            };
          } else {
            newProfile = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || 'Staff Member',
              role: 'STAFF'
            };
          }

          // Try to save profile, but don't block primary admins if it fails
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
          
          if (insertError) {
             console.error("Failed to sync profile:", insertError);
             if (user.email === 'admin@ysjpoultry.com' || user.email === 'admin@ysj.com' || user.email === 'adeagbojohnluj@gmail.com') {
                setUserProfile(newProfile);
                setAuthLoading(false);
                return;
             }
             throw insertError;
          }
          setUserProfile(newProfile);
        }
      } catch (err: any) {
        console.error("Profile Fetch Error:", err);
        setAuthError(`Profile Error: ${err.message}`);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [retryCount]);

  // Handle Sidebar Resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = userProfile?.role === 'ADMIN' || 
                  userProfile?.role === 'MD' || 
                  currentUser?.email === 'admin@ysjpoultry.com' ||
                  currentUser?.email === 'admin@ysj.com' ||
                  currentUser?.email === 'adeagbojohnluj@gmail.com';

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'Overview') as 'Overview' | 'Batches' | 'Reports' | 'Sales' | 'Staff' | 'Maintenance';
  
  const setActiveTab = (tab: string) => {
    window.location.href = `/admin?tab=${tab}`;
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Supabase Data
  const [birdBatches, setBirdBatches] = useState<BirdRecord[]>([]);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Daily Report UI state
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false);
  const [selectedBatchForReport, setSelectedBatchForReport] = useState<BirdRecord | null>(null);
  const [selectedBatchForReportsList, setSelectedBatchForReportsList] = useState<BirdRecord | null>(null);
  const [editingReport, setEditingReport] = useState<DailyReport | null>(null);

  // Edit Batch UI state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBatchForEdit, setSelectedBatchForEdit] = useState<BirdRecord | null>(null);

  // Staff Creation State
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Fetch Supabase Records
  useEffect(() => {
    if (!currentUser) return;

    const fetchBatches = async () => {
      const { data } = await supabase.from('bird_batches').select('*').order('arrival_date', { ascending: false });
      if (data) setBirdBatches(data as any);
    };

    const fetchReports = async () => {
      const { data } = await supabase.from('daily_reports').select('*').order('date', { ascending: false });
      if (data) setDailyReports(data as any);
    };

    const fetchSales = async () => {
      const { data } = await supabase.from('sales').select('*').order('date', { ascending: false });
      if (data) setSales(data as any);
    };

    const fetchComments = async () => {
      const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: true });
      if (data) setComments(data as any);
    };

    fetchBatches();
    fetchReports();
    fetchSales();
    fetchComments();

    const batchesSub = supabase.channel('batches').on('postgres_changes', { event: '*', table: 'bird_batches', schema: 'public' }, fetchBatches).subscribe();
    const reportsSub = supabase.channel('reports').on('postgres_changes', { event: '*', table: 'daily_reports', schema: 'public' }, fetchReports).subscribe();
    const salesSub = supabase.channel('sales').on('postgres_changes', { event: '*', table: 'sales', schema: 'public' }, fetchSales).subscribe();
    const commentsSub = supabase.channel('comments').on('postgres_changes', { event: '*', table: 'comments', schema: 'public' }, fetchComments).subscribe();

    let profilesSub: any = null;

    if (isAdmin) {
      const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*');
        if (data) setAllUsers(data as any);
      };
      fetchUsers();
      
      profilesSub = supabase.channel('profiles')
        .on('postgres_changes', { event: '*', table: 'profiles', schema: 'public' }, fetchUsers)
        .subscribe();
    }

    return () => {
      batchesSub.unsubscribe();
      reportsSub.unsubscribe();
      salesSub.unsubscribe();
      commentsSub.unsubscribe();
      if (profilesSub) profilesSub.unsubscribe();
    };
  }, [currentUser, isAdmin]);

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      if (activeTab === 'Batches' && selectedBatchForEdit) {
        await supabase.from('bird_batches').update({
          count: Number(formData.get('count')),
          type: formData.get('type'),
          arrival_date: formData.get('arrivalDate'),
          expected_harvest: formData.get('expectedHarvest'),
          feed_stock: Number(formData.get('feedStock') || 0),
        }).eq('id', selectedBatchForEdit.id);
        setIsEditModalOpen(false);
        setSelectedBatchForEdit(null);
        return;
      }

      if (activeTab === 'Batches') {
        await supabase.from('bird_batches').insert({
          count: Number(formData.get('count')),
          type: formData.get('type'),
          arrival_date: formData.get('arrivalDate'),
          expected_harvest: formData.get('expectedHarvest'),
          feed_stock: Number(formData.get('feedStock') || 0),
          status: 'Growing',
          created_by: currentUser.id
        });
      } else if (activeTab === 'Sales') {
        await supabase.from('sales').insert({
          amount: Number(formData.get('amount')),
          customer: formData.get('customer'),
          date: formData.get('date'),
          status: 'Pending',
          created_by: currentUser.id
        });
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedBatchForEdit(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDailyReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBatchForReport || !userProfile) return;
    const formData = new FormData(e.currentTarget);
    const mortality = Number(formData.get('mortality'));
    const feedUsed = Number(formData.get('feedUsed'));
    const date = formData.get('date') as string;
    const notes = formData.get('notes') as string;

    try {
      // 1. Create Report
      await supabase.from('daily_reports').insert({
        batch_id: selectedBatchForReport.id,
        date,
        mortality,
        feed_used: feedUsed,
        notes,
        created_by: currentUser.id
      });

      // 2. Update Batch Balance
      await supabase.from('bird_batches').update({
        count: selectedBatchForReport.count - mortality,
        feed_stock: (selectedBatchForReport.feed_stock || 0) - feedUsed,
      }).eq('id', selectedBatchForReport.id);

      setIsDailyReportModalOpen(false);
      setSelectedBatchForReport(null);
    } catch (err) {
       console.error(err);
    }
  };

  const handleUpdateDailyReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReport || !selectedBatchForReportsList || !userProfile) return;
    
    const formData = new FormData(e.currentTarget);
    const newMortality = Number(formData.get('mortality'));
    const newFeedUsed = Number(formData.get('feedUsed'));
    const date = formData.get('date') as string;
    const notes = formData.get('notes') as string;

    const mortalityDiff = newMortality - editingReport.mortality;
    const feedDiff = newFeedUsed - editingReport.feed_used;

    try {
      // 1. Update Report
      await supabase.from('daily_reports').update({
        mortality: newMortality,
        feed_used: newFeedUsed,
        date,
        notes,
        updated_by: currentUser.id
      }).eq('id', editingReport.id);

      // 2. Update Batch Balance (using diffs)
      await supabase.from('bird_batches').update({
        count: selectedBatchForReportsList.count - mortalityDiff,
        feed_stock: (selectedBatchForReportsList.feed_stock || 0) - feedDiff,
      }).eq('id', selectedBatchForReportsList.id);

      setEditingReport(null);
    } catch (err) {
       console.error(err);
    }
  };

  const handleDeleteDailyReport = async (report: DailyReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!isAdmin) {
      alert("Access Denied: Only Admins can delete reports.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this report? This will reverse the mortality and feed deductions for the batch.")) return;
    
    const batchData = birdBatches.find(b => b.id === report.batch_id);
    
    try {
      // 1. Delete Report
      await supabase.from('daily_reports').delete().eq('id', report.id);

      // 2. Reverse Batch Balance (only if batch still exists)
      if (batchData) {
        await supabase.from('bird_batches').update({
          count: batchData.count + report.mortality,
          feed_stock: (batchData.feed_stock || 0) + report.feed_used,
        }).eq('id', batchData.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedBatchForReportsList || !isAdmin) return;
    
    if (!window.confirm(`⚠️ FINAL WARNING: You are about to PERMANENTLY DELETE Batch ${selectedBatchForReportsList.batchName || 'Record'} and ALL its history.\n\nType "DELETE" to confirm.`)) return;
    
    const secondConfirm = window.prompt(`Please type "DELETE" to confirm permanent removal:`);
    if (secondConfirm !== 'DELETE') return;

    try {
      // Cascade delete is usually handled by DB in Supabase if configured, 
      // but let's handle it manually if unsure.
      await supabase.from('daily_reports').delete().eq('batch_id', selectedBatchForReportsList.id);
      await supabase.from('bird_batches').delete().eq('id', selectedBatchForReportsList.id);
      
      alert(`Successfully cleared batch and associated reports.`);
      setSelectedBatchForReportsList(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGlobalPurge = async () => {
    if (!isAdmin) return;
    
    const confirm1 = window.confirm("⚠️ EXTREME ACTION: You are about to DELETE ALL DATA (Batches, Reports, Sales, Comments).\n\nThis will completely wipe the system's operational history. Are you absolutely sure?");
    if (!confirm1) return;

    const confirm2 = window.prompt("Type 'FACTORY RESET' to confirm irreversible deletion of all farm records:");
    if (confirm2 !== 'FACTORY RESET') return;

    try {
      // Supabase truncate or multi-delete
      await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('daily_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('bird_batches').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      alert("System Reset Successful. All data has been purged.");
      setActiveTab('Overview');
    } catch (err) {
      console.error("Purge Error:", err);
    }
  };

  const handleResetBatchHistory = async () => {
    if (!selectedBatchForReportsList) return;
    
    if (!isAdmin) {
      alert("Access Denied: Only Admins can perform this action.");
      return;
    }
    
    const targetBatchId = selectedBatchForReportsList.id;
    const reportsToDelete = dailyReports.filter(r => r.batchId === targetBatchId);
    
    if (reportsToDelete.length === 0) {
      alert("No records found to delete for this batch.");
      return;
    }

    if (!window.confirm(`⚠️ CRITICAL ACTION: You are about to permanently delete all ${reportsToDelete.length} daily reports for ${selectedBatchForReportsList.batchName || 'this batch'}.\n\nThis cannot be undone. Proceed?`)) return;
    
    const resetStats = window.confirm("Would you like to REVERSE the bird count and feed balance deductions according to the deleted reports?");

    try {
      // 1. Delete all reports
      await supabase.from('daily_reports').delete().eq('batch_id', targetBatchId);

      // 2. If requested, reset the batch bird count
      if (resetStats) {
        const totalMortality = reportsToDelete.reduce((sum, r) => sum + r.mortality, 0);
        const totalFeedUsed = reportsToDelete.reduce((sum, r) => sum + r.feed_used, 0);
        
        await supabase.from('bird_batches').update({
          count: selectedBatchForReportsList.count + totalMortality,
          feed_stock: (selectedBatchForReportsList.feed_stock || 0) + totalFeedUsed,
        }).eq('id', targetBatchId);
      }

      alert(`Success: ${reportsToDelete.length} records purged correctly.`);
    } catch (err) {
      console.error("Batch Reset Error:", err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) return;
    setStaffLoading(true);
    setStaffError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as any;

    try {
      await supabase.from('authorized_staff').insert({
        email,
        name,
        role,
        invited_by: currentUser.id
      });

      setIsAddModalOpen(false);
    } catch (err: any) {
      setStaffError(err.message || "Could not authorize staff email.");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleDeleteStaff = async (staff: UserProfile) => {
    if (!isAdmin) return;
    if (staff.id === currentUser.id) {
       alert("You cannot delete your own profile.");
       return;
    }
    if (staff.email === 'admin@ysjpoultry.com' || staff.email === 'adeagbojohnluj@gmail.com') {
       alert("This primary admin account cannot be deleted.");
       return;
    }

    if (!window.confirm(`Are you sure you want to remove ${staff.name} from the staff list? This will also revoke their login authorization.`)) return;

    try {
      // 1. Remove from profiles
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', staff.id);
      if (profileError) throw profileError;

      // 2. Remove from authorized_staff
      const { error: authError } = await supabase.from('authorized_staff').delete().eq('email', staff.email);
      if (authError) throw authError;
      
      alert(`Access revoked for ${staff.name}.`);
    } catch (err: any) {
      console.error("Delete Staff Error:", err);
      alert(`Error revoking access: ${err.message}`);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !selectedEntityId || !userProfile) return;

    try {
      await supabase.from('comments').insert({
        entity_id: selectedEntityId,
        text: commentText,
        author_id: currentUser.id,
        author_name: userProfile.name,
      });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-green overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Pulsing ring */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-8 bg-primary-gold rounded-[2rem] blur-2xl"
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative z-10 border-2 border-primary-gold/20"
          >
            <Bird size={48} className="text-primary-green" />
          </motion.div>
          
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">
              Initializing Farm Portal
            </p>
            {authError && (
              <p className="text-red-300 text-[9px] font-medium max-w-[200px] text-center">
                {authError}
              </p>
            )}
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            onClick={() => supabase.auth.signOut()}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-white/40 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors border border-white/10 px-3 py-1 rounded-full"
          >
            Sign Out & Reset
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <AuthForms onSuccess={() => setRetryCount(prev => prev + 1)} />
        {authError && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 z-50">
            <AlertCircle size={16} /> {authError}
          </div>
        )}
      </>
    );
  }

  if (currentUser && !userProfile) {
    const isOffline = !window.navigator.onLine;
    const isNetworkError = authError?.toLowerCase().includes('offline') || authError?.toLowerCase().includes('network');

    return (
       <div className="min-h-screen flex items-center justify-center bg-primary-green p-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center space-y-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto",
            isOffline || isNetworkError ? "bg-amber-50 text-amber-500" : "bg-red-50 text-red-500"
          )}>
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              {isOffline || isNetworkError ? "Connection Issue" : "Authorization Error"}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              {isOffline ? "You are currently offline. Please check your internet connection." : (authError || "We couldn't initialize your access profile.")}
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                setAuthLoading(true);
                setAuthError(null);
                setRetryCount(prev => prev + 1);
              }}
              className="w-full py-4 bg-primary-green text-white rounded-2xl font-bold hover:bg-primary-green/90 transition-all flex items-center justify-center gap-2"
            >
              <Activity size={18} />
              Retry Connection
            </button>

            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out & Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const birdStats = {
    total: birdBatches.reduce((acc, b) => acc + (b.status !== 'Harvested' ? b.count : 0), 0),
    ready: birdBatches.filter(b => b.status === 'Ready').length,
    batches: birdBatches.length,
    mortality: dailyReports.reduce((acc, r) => acc + r.mortality, 0),
    feedStock: birdBatches.reduce((acc, b) => acc + (b.feed_stock || 0), 0)
  };

  const revenue = sales.reduce((acc, s) => acc + s.amount, 0);

  // Charts
  const lineChartData = {
    labels: dailyReports.slice(-7).reverse().map(r => r.date),
    datasets: [
      {
        label: 'Mortality Trace',
        data: dailyReports.slice(-7).reverse().map(r => r.mortality),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Feed Consumption',
        data: dailyReports.slice(-7).reverse().map(r => r.feed_used),
        borderColor: '#1B4332',
        backgroundColor: 'rgba(27, 67, 50, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  return (
    <div className={cn("min-h-screen font-sans flex", isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900")}>
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-primary-green transition-all duration-300 transform shadow-2xl",
        isSidebarOpen ? "w-72 translate-x-0" : "w-0 lg:w-20 lg:translate-x-0 overflow-hidden"
      )}>
        <div className="p-6 flex items-center justify-between gap-3">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-gold">
               <span className="text-primary-green font-black">YSJ</span>
             </div>
             {isSidebarOpen && <span className="text-white font-display font-bold text-lg tracking-tight">Farm Portal</span>}
           </div>
           
           {/* Mobile Close Button */}
           <button 
             onClick={() => setIsSidebarOpen(false)}
             className="p-2 text-white/60 hover:text-white lg:hidden"
           >
             <X size={20} />
           </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {[
            { id: 'Overview', icon: LayoutDashboard },
            { id: 'Batches', icon: Bird },
            { id: 'Reports', icon: ClipboardList },
            { id: 'Sales', icon: TrendingUp },
            { id: 'Staff', icon: UserCheck },
            { id: 'Maintenance', icon: Wrench, adminOnly: true },
          ].filter(item => !item.adminOnly || isAdmin).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all whitespace-nowrap",
                activeTab === item.id 
                  ? "bg-primary-gold text-primary-green font-bold shadow-lg shadow-black/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.id}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 px-4 w-full">
           <button 
            onClick={() => {
              supabase.auth.signOut();
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 w-full transition-all whitespace-nowrap"
           >
             <LogOut size={20} />
             {isSidebarOpen && <span>Log Out</span>}
           </button>
        </div>
      </aside>

      <main className={cn(
        "flex-grow transition-all duration-300 p-6 md:p-10 min-w-0 w-full",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 mr-auto">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
                <Menu size={20} />
             </button>
             <div>
                <h1 className="text-2xl font-display font-bold">{activeTab}</h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                  Logged in as <span className="text-primary-gold font-bold">{userProfile?.name}</span> ({userProfile?.role})
                </p>
             </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white border border-gray-200 rounded-xl">
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div className="w-10 h-10 rounded-full bg-primary-gold p-0.5 border border-primary-green">
               <img src={`https://ui-avatars.com/api/?name=${userProfile?.name}&background=1B4332&color=D4AF37`} className="rounded-full" alt="User" />
             </div>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Birds', value: birdStats.total.toLocaleString(), icon: Bird, color: 'text-primary-green' },
                { label: 'Mortality Trace', value: birdStats.mortality.toString(), icon: AlertCircle, color: 'text-red-500' },
                { label: 'Feed Balance', value: birdStats.feedStock.toString() + ' Bags', icon: ShoppingBag, color: 'text-amber-600' },
                { label: 'Revenue Log', value: '₦' + (revenue/1000000).toFixed(1) + 'M', icon: TrendingUp, color: 'text-blue-500' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-display font-bold mb-8">Production Trends</h2>
                <div className="h-[300px]">
                  <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                 <h2 className="text-lg font-display font-bold mb-8">Batch Wellness</h2>
                 <div className="h-[200px]">
                   <Doughnut data={{
                     labels: ['Healthy', 'Mortality'],
                     datasets: [{ data: [birdStats.total, birdStats.mortality || 1], backgroundColor: ['#1B4332', '#ef4444'], borderWidth: 0 }]
                   }} />
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Reports' && (
          <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-primary-green">Production Log</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest opacity-60 italic">Complete history of all mortality and usage reports</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                       <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <th className="px-8 py-6">Timeline</th>
                          <th className="px-8 py-6">Source Batch</th>
                          <th className="px-8 py-6 text-center">Stats</th>
                          <th className="px-8 py-6">Observations</th>
                          <th className="px-8 py-6 text-right">Control</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {dailyReports
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(report => {
                          const batch = birdBatches.find(b => b.id === report.batch_id);
                          return (
                            <motion.tr 
                              key={report.id} 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="hover:bg-gray-50/50 transition-colors group"
                             >
                               <td className="px-8 py-8">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">{new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">{new Date(report.date).getFullYear()}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold shadow-sm">
                                      <Bird size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-700">{batch?.batchName || 'Unknown Batch'}</span>
                                      <span className="text-[10px] text-gray-400 font-bold">{batch?.strain || 'Poultry'}</span>
                                    </div>
                                  </div>
                               </td>
                               <td className="px-8 py-8">
                                  <div className="flex items-center justify-center gap-4">
                                     <div className="text-center">
                                       <p className="text-[10px] text-gray-400 font-bold uppercase">Mortality</p>
                                       <p className={cn("text-xs font-bold", report.mortality > 0 ? "text-red-500" : "text-gray-400")}>{report.mortality}</p>
                                     </div>
                                     <div className="w-px h-6 bg-gray-100" />
                                     <div className="text-center">
                                       <p className="text-[10px] text-gray-400 font-bold uppercase">Feed Used</p>
                                       <p className="text-xs font-bold text-primary-green">{report.feed_used} Bags</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-8">
                                  <p className="text-xs text-slate-500 font-medium italic line-clamp-2 max-w-[240px]">
                                    {report.notes ? `"${report.notes}"` : 'No entry recorded'}
                                  </p>
                               </td>
                               <td className="px-8 py-8 text-right">
                                  <div className="flex items-center justify-end gap-2 transition-all">
                                     <button 
                                      onClick={() => {
                                        setSelectedBatchForReportsList(batch || null);
                                        setEditingReport(report);
                                      }}
                                      className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary-gold hover:border-primary-gold rounded-xl transition-all shadow-sm"
                                     >
                                       <Pencil size={16} />
                                     </button>
                                     <button 
                                      onClick={(e) => handleDeleteDailyReport(report, e)}
                                      className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all shadow-sm"
                                     >
                                       <Trash2 size={16} />
                                     </button>
                                  </div>
                               </td>
                            </motion.tr>
                          );
                        })}
                    </tbody>
                 </table>
               </div>
               
               {dailyReports.length === 0 && (
                 <div className="py-24 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                       <ClipboardList size={40} className="text-gray-300" />
                    </div>
                    <div>
                       <p className="text-lg font-bold text-gray-400 tracking-tight">No historical data found</p>
                       <p className="text-xs text-gray-400 font-medium">Monthly reports will appear here as they are generated.</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {(activeTab === 'Batches' || activeTab === 'Sales') && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-display font-bold text-primary-green">Manage {activeTab} Records</h2>
               {isAdmin && (
                 <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-gold hover:text-primary-green transition-all shadow-lg"
                 >
                   <Plus size={20} /> Add New {activeTab === 'Batches' ? 'Batch' : 'Sale'}
                 </button>
               )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                           <th className="p-6">ID</th>
                           <th className="p-6">Detail</th>
                           <th className="p-6">Status</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {(activeTab === 'Batches' ? birdBatches : sales).map((record: any, index: number) => (
                           <motion.tr 
                            key={record.id} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedEntityId(record.id)}
                            className={cn(
                              "border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors text-center",
                              selectedEntityId === record.id ? "bg-primary-gold/5" : ""
                            )}
                           >
                              <td className="p-6 font-mono text-xs">#{record.id.slice(-4)}</td>
                              <td className="p-6">
                                 <p className="font-bold">{activeTab === 'Batches' ? record.count + ' ' + record.type : '₦' + record.amount.toLocaleString()}</p>
                                 <p className="text-[10px] text-gray-400">{activeTab === 'Batches' ? record.arrival_date : record.customer}</p>
                                 {activeTab === 'Batches' && (
                                   <div className="mt-2 flex items-center gap-2">
                                     <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg font-bold text-slate-500">
                                       Feed: {record.feed_stock || 0} bags
                                     </span>
                                     <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBatchForReport(record);
                                        setIsDailyReportModalOpen(true);
                                      }}
                                      className="text-[10px] bg-primary-gold/20 text-primary-gold hover:bg-primary-gold hover:text-primary-green px-2 py-0.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                                     >
                                       <ClipboardList size={12} /> Report
                                     </button>
                                     <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBatchForReportsList(record);
                                      }}
                                      className="text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-200 px-2 py-0.5 rounded-lg font-bold transition-colors flex items-center gap-1 border border-slate-200"
                                     >
                                       <Activity size={10} /> History
                                     </button>
                                   </div>
                                 )}
                              </td>
                              <td className="p-6">
                                 <span className={cn(
                                   "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                   record.status === 'Ready' || record.status === 'Paid' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                 )}>
                                   {record.status}
                                 </span>
                              </td>
                           </motion.tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Comments Section */}
               <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-[600px]">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                     <div className="flex items-center gap-3">
                        <MessageSquare className="text-primary-gold" />
                        <h2 className="text-lg font-display font-bold">Records Discussion</h2>
                     </div>
                     {!selectedEntityId && <p className="text-xs text-gray-400 italic">Select a record to participate</p>}
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-8 space-y-6">
                     {selectedEntityId ? (
                       comments.filter(c => c.entity_id === selectedEntityId).length > 0 ? (
                         comments.filter(c => c.entity_id === selectedEntityId).map(comment => (
                           <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            key={comment.id} 
                            className="flex gap-4 group"
                           >
                              <div className="w-10 h-10 rounded-xl bg-primary-green/5 flex items-center justify-center flex-shrink-0 text-primary-green font-bold text-xs">
                                 {comment.author_name?.[0] || 'S'}
                              </div>
                              <div className="flex-grow bg-gray-50 p-4 rounded-2xl rounded-tl-none relative border border-gray-100">
                                 <p className="text-[10px] font-black text-primary-green mb-1 uppercase tracking-tighter">{comment.author_name}</p>
                                 <p className="text-sm text-gray-600 leading-relaxed italic">"{comment.text}"</p>
                              </div>
                           </motion.div>
                         ))
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-2">
                            <MessageSquare size={48} className="opacity-20" />
                            <p className="font-medium italic text-sm">No observations yet for this record.</p>
                         </div>
                       )
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                          <Activity size={64} className="animate-pulse opacity-20" />
                          <p className="font-medium text-center max-w-[200px]">Select a record from the history to view or add observations.</p>
                       </div>
                     )}
                  </div>

                  <div className="p-6 border-t border-gray-50 bg-gray-50/10">
                     <form onSubmit={handlePostComment} className="flex gap-3">
                        <input 
                          disabled={!selectedEntityId}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add your observation..." 
                          className="flex-grow px-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold transition-all disabled:opacity-50 shadow-inner"
                        />
                        <button 
                          disabled={!selectedEntityId || !commentText}
                          className="w-14 h-14 bg-primary-gold text-primary-green rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary-gold/20"
                        >
                           <Send size={20} />
                        </button>
                     </form>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Maintenance' && isAdmin && (
          <div className="max-w-4xl space-y-12 pb-20">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-primary-green">System Maintenance</h2>
              <p className="text-gray-500 text-sm font-medium">Critical system operations and administrative controls.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <Database size={32} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-bold text-slate-800">Global Data Purge</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Permanently delete all production records including batches, daily reports, sales history, and comments. 
                    <span className="block mt-2 font-bold text-red-500">This action cannot be undone.</span>
                  </p>
                </div>
                <button 
                  onClick={handleGlobalPurge}
                  className="w-full py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  Reset System (Factory Reset)
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8"
              >
                <div className="w-16 h-16 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold">
                   <ShieldCheck size={32} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-bold text-slate-800">Security Audit</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Review and manage staff access levels. You have {allUsers.length} registered system users across all roles.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('Staff')}
                  className="w-full py-4 bg-gray-50 text-slate-600 hover:bg-slate-800 hover:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Manage Staff Roles
                </button>
              </motion.div>
            </div>

            <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4">
              <div className="flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-amber-800">Maintenance Protocol</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Data purging is designed for season transitions or system migrations. 
                    Ensure you have exported any necessary reports before proceeding with a factory reset.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Staff' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                 <h2 className="text-2xl font-display font-bold text-primary-green">Farm Personnel</h2>
                 <p className="text-xs text-gray-500 font-medium">Monitoring access across the production chain</p>
               </div>
               {isAdmin && (
                 <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-gold hover:text-primary-green transition-all shadow-lg"
                 >
                   <UserPlus size={20} /> Register New Member
                 </button>
               )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.map((staff) => (
                <div key={staff.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-green">
                      <Users size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{staff.name}</h4>
                      <span className={cn(
                        "text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full",
                        staff.role === 'ADMIN' || staff.role === 'MD' ? "bg-primary-green text-white" : "bg-gray-100 text-gray-500"
                      )}>
                        {staff.role}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{staff.email}</p>
                    </div>
                  </div>
                  
                  {isAdmin && staff.id !== currentUser.id && (
                    <button 
                      onClick={() => handleDeleteStaff(staff)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                      title="Revoke Access"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-green/80 backdrop-blur-md" 
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedBatchForEdit(null);
              }}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl relative z-10 w-full max-w-lg space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold">
                  {isEditModalOpen ? 'Edit Record' : (activeTab === 'Staff' ? 'Staff Registration' : `New ${activeTab.slice(0, -1)} Record`)}
                </h2>
                <button onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedBatchForEdit(null);
                }} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
              </div>
              
              {activeTab === 'Staff' && !isEditModalOpen ? (
                <form onSubmit={handleAddStaff} className="space-y-6">
                  {staffError && (
                    <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100 leading-relaxed">
                      {staffError}
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <div className="flex gap-3">
                      <ShieldCheck className="text-blue-500 shrink-0" size={18} />
                      <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                        Since Google login is enabled, you only need to authorize the email. The staff member will gain access when they sign in with their Google account.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Full Name</label>
                    <input required name="name" type="text" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" placeholder="Ademola Adebayo" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Allowed Google Email</label>
                    <input required name="email" type="email" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" placeholder="staff@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Authorization Role</label>
                    <select name="role" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold cursor-pointer font-bold">
                      <option value="STAFF">STAFF (Viewer)</option>
                      <option value="MANAGER">MANAGER (Reviewer)</option>
                      <option value="MD">MANAGING DIRECTOR (Stakeholder)</option>
                      <option value="ADMIN">ADMIN (Full Control)</option>
                    </select>
                  </div>
                  <button 
                    disabled={staffLoading}
                    className="w-full py-5 bg-primary-gold text-primary-green font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {staffLoading ? <div className="w-6 h-6 border-4 border-primary-green border-t-white rounded-full animate-spin" /> : <><ShieldCheck size={20} /> Authorize Membership Access</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateRecord} className="space-y-6">
                  {activeTab === 'Batches' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Bird Count</label>
                        <input required name="count" type="number" defaultValue={selectedBatchForEdit?.count} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" placeholder="e.g. 500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Bird Type</label>
                        <select name="type" defaultValue={selectedBatchForEdit?.type} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold appearance-none font-bold">
                            <option>Broiler</option>
                            <option>Layer</option>
                            <option>Cockerel</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Arrival Date</label>
                          <input required name="arrivalDate" type="date" defaultValue={selectedBatchForEdit?.arrivalDate} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Expected Harvest</label>
                          <input required name="expectedHarvest" type="date" defaultValue={selectedBatchForEdit?.expectedHarvest} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Current Feed Stock (Bags)</label>
                        <input required name="feedStock" type="number" defaultValue={selectedBatchForEdit?.feedStock} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" placeholder="e.g. 50" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Sale Amount (₦)</label>
                        <input required name="amount" type="number" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" placeholder="e.g. 500000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Customer Name</label>
                        <input required name="customer" type="text" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" placeholder="e.g. Grand Hotels" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Date of Sale</label>
                        <input required name="date" type="date" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" />
                      </div>
                    </>
                  )}
                  
                  <button className="w-full py-5 bg-primary-gold text-primary-green font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    {isEditModalOpen ? 'Update Production Record' : 'Commit Record to System'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Daily Report Modal */}
      <AnimatePresence>
        {isDailyReportModalOpen && selectedBatchForReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
              onClick={() => setIsDailyReportModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl relative z-10 w-full max-w-lg space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold">Daily Report</h2>
                  <p className="text-xs text-gray-500 font-bold opacity-60">Batch: {selectedBatchForReport.count} {selectedBatchForReport.type}</p>
                </div>
                <button onClick={() => setIsDailyReportModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
              </div>

              <form onSubmit={handleCreateDailyReport} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Mortality (Birds)</label>
                    <input required name="mortality" type="number" defaultValue="0" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Feed Used (Bags)</label>
                    <input required name="feedUsed" type="number" defaultValue="0" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Reporting Date</label>
                  <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 px-2 tracking-widest">Observations / Notes</label>
                  <textarea name="notes" className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-gold h-28 resize-none" placeholder="e.g. Birds look healthy, increased appetite..."></textarea>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={18} />
                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                      Submission will automatically deduct feed bags from the batch inventory and update the live bird count.
                    </p>
                  </div>
                </div>

                <button className="w-full py-5 bg-primary-green text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Confirm & Sync Report
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reports History Modal */}
      <AnimatePresence>
        {selectedBatchForReportsList && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
              onClick={() => setSelectedBatchForReportsList(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold">Production History</h2>
                  <p className="text-xs text-gray-500 font-bold opacity-60">
                    Track mortality and feed consumption for this batch
                  </p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleResetBatchHistory}
                        className="px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-amber-100"
                      >
                        Reset History
                      </button>
                      <button 
                        onClick={handleDeleteBatch}
                        className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-red-100"
                      >
                        Delete Batch
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedBatchForEdit(selectedBatchForReportsList);
                      setIsEditModalOpen(true);
                    }}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-primary-gold rounded-2xl transition-all"
                  >
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => setSelectedBatchForReportsList(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
                </div>
              </div>

              <div className="space-y-4">
                {dailyReports
                  .filter(r => r.batchId === selectedBatchForReportsList.id || r.batchId === selectedBatchForReportsList.id.slice(-4))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((report, idx) => (
                    <motion.div 
                      key={report.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group"
                    >
                      {editingReport?.id === report.id ? (
                        <form onSubmit={handleUpdateDailyReport} className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Date</label>
                            <input name="date" type="date" defaultValue={report.date} className="w-full bg-white px-4 py-2 rounded-xl text-xs font-bold outline-none border border-gray-100" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Mortality</label>
                            <input name="mortality" type="number" defaultValue={report.mortality} className="w-full bg-white px-4 py-2 rounded-xl text-xs font-bold outline-none border border-gray-100" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Feed (Bags)</label>
                            <input name="feedUsed" type="number" defaultValue={report.feed_used} className="w-full bg-white px-4 py-2 rounded-xl text-xs font-bold outline-none border border-gray-100" />
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" className="flex-grow py-2 bg-primary-green text-white text-[10px] font-bold rounded-xl transition-all h-[34px]">Update</button>
                            <button 
                              type="button" 
                              onClick={(e) => handleDeleteDailyReport(report, e)} 
                              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={14}/>
                            </button>
                            <button type="button" onClick={() => setEditingReport(null)} className="p-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"><X size={14}/></button>
                          </div>
                          <div className="col-span-full space-y-1 mt-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Observations</label>
                            <textarea name="notes" defaultValue={report.notes} className="w-full bg-white px-4 py-2 rounded-xl text-xs font-bold outline-none border border-gray-100 h-16 resize-none" />
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0">
                               <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(report.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                               <p className="font-display font-bold text-primary-gold leading-none">{new Date(report.date).getDate()}</p>
                            </div>
                            <div className="space-y-1">
                               <div className="flex gap-3">
                                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded-lg">
                                   <Activity size={10} className="text-red-500" />
                                   <span className="text-[10px] font-bold text-red-600">{report.mortality} Bird Lost</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-green/10 rounded-lg">
                                   <ShoppingBag size={10} className="text-primary-green" />
                                   <span className="text-[10px] font-bold text-primary-green">{report.feed_used} Bags Feed</span>
                                 </div>
                               </div>
                               <p className="text-xs text-gray-500 font-medium line-clamp-1">{report.notes || 'No observations recorded'}</p>
                            </div>
                          </div>
                            <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                            <div className="text-right">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Report Locked</p>
                               <p className="text-[10px] text-gray-500 font-medium underline underline-offset-2">Verified Entry</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingReport(report)}
                                className="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-primary-gold hover:border-primary-gold rounded-xl flex items-center justify-center transition-all shadow-sm"
                              >
                                <Pencil size={18} />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteDailyReport(report, e)}
                                className="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl flex items-center justify-center transition-all shadow-sm"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                
                {dailyReports.filter(r => r.batchId === selectedBatchForReportsList.id || r.batchId === selectedBatchForReportsList.id.slice(-4)).length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <ClipboardList className="text-gray-200" size={32} />
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No reports archived for this batch</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
