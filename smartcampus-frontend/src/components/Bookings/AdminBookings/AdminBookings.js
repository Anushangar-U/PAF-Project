import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ResourceService from '../../../services/ResourceService';
import { Calendar, Clock, CheckCircle2, XCircle, Filter, ShieldCheck, UserCircle } from 'lucide-react';

const API_URL = 'http://localhost:9091/api/bookings';
const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [approveId, setApproveId] = useState(null);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const [resourceMap, setResourceMap] = useState({});

    useEffect(() => {
        ResourceService.getAllResources()
            .then(res => {
                const map = {};
                res.data.forEach(r => { map[String(r.id)] = r.name; });
                setResourceMap(map);
            })
            .catch(() => setResourceMap({}));
        fetchBookings();
    }, []);

    const applyFilters = useCallback(() => {
        let data = [...bookings];
        if (statusFilter !== 'ALL') data = data.filter((b) => b.status === statusFilter);
        if (dateFilter) {
            data = data.filter((b) => {
                if (!b.startTime) return false;
                const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
                return bookingDate === dateFilter;
            });
        }
        setFiltered(data);
    }, [bookings, statusFilter, dateFilter]);

    useEffect(() => { applyFilters(); setCurrentPage(1); }, [applyFilters, statusFilter, dateFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(API_URL);
            setBookings(res.data);
        } catch {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const renderStatusBadge = (status) => {
        const lower = status?.toLowerCase() || '';
        if (lower === 'approved') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1"/>Approved</span>;
        if (lower === 'pending') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/>Pending</span>;
        if (lower === 'rejected') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/>Rejected</span>;
        if (lower === 'cancelled') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800"><XCircle className="w-3 h-3 mr-1"/>Cancelled</span>;
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    };

    const openApproveConfirm = (id) => { setApproveId(id); setShowApproveConfirm(true); };
    const handleApprove = async () => {
        if (!approveId) return;
        try {
            await axios.put(`${API_URL}/${approveId}/approve`);
            setShowApproveConfirm(false);
            setApproveId(null);
            fetchBookings();
        } catch {
            alert('Failed to approve booking');
        }
    };

    const openRejectModal = (id) => { setRejectId(id); setRejectReason(''); setShowRejectModal(true); };
    const handleReject = async () => {
        if (!rejectId) return;
        if (!rejectReason.trim()) { alert('Please enter a rejection reason'); return; }
        try {
            await axios.put(`${API_URL}/${rejectId}/reject`, { reason: rejectReason });
            setShowRejectModal(false);
            setRejectId(null);
            setRejectReason('');
            fetchBookings();
        } catch {
            alert('Failed to reject booking');
        }
    };

    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const approved = bookings.filter((b) => b.status === 'APPROVED').length;
    const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3"><ShieldCheck className="text-indigo-600 w-8 h-8"/> Admin Bookings</h1>
                    <p className="text-muted-foreground mt-1 text-slate-500">Manage, review, and take action on all resource bookings</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="rounded-xl border bg-white text-slate-900 shadow-sm transition-all hover:shadow-md p-6 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Total Bookings</h3>
                        <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="relative z-10"><div className="text-3xl font-bold">{total}</div></div>
                </div>
                 <div className="rounded-xl border bg-white text-slate-900 shadow-sm transition-all hover:shadow-md p-6 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Pending</h3>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="relative z-10"><div className="text-3xl font-bold text-amber-600">{pending}</div></div>
                </div>
                 <div className="rounded-xl border bg-white text-slate-900 shadow-sm transition-all hover:shadow-md p-6 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Approved</h3>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="relative z-10"><div className="text-3xl font-bold text-emerald-600">{approved}</div></div>
                </div>
                 <div className="rounded-xl border bg-white text-slate-900 shadow-sm transition-all hover:shadow-md p-6 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Rejected</h3>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="relative z-10"><div className="text-3xl font-bold text-red-600">{rejected}</div></div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <input 
                        type="date" 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)} 
                        className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                    />
                </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                 <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex items-center justify-center p-12 text-slate-500">Loading bookings...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center p-12 text-red-500">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex items-center justify-center p-12 text-slate-500">No bookings match your filters.</div>
                    ) : (
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-slate-50/50">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Resource</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">User</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Timeline</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Purpose</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-slate-500 hover:text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 text-slate-700">
                                {paginated.map((b) => (
                                    <tr key={b.id} className="border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-50">
                                        <td className="p-4 align-middle font-mono text-slate-500 text-xs" title={b.id}>
                                            {b.id ? `...${b.id.slice(-6)}` : ''}
                                        </td>
                                        <td className="p-4 align-middle font-medium text-slate-900" title={b.resourceId}>
                                            {resourceMap[String(b.resourceId)] || b.resourceId || 'N/A'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-4 h-4 text-slate-400" />
                                                User {b.userId}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle whitespace-nowrap">
                                            <div className="flex flex-col text-xs">
                                                <span className="font-semibold text-slate-700">{formatDateOnly(b.startTime)}</span>
                                                <span className="text-slate-500">{formatTimeOnly(b.startTime)} - {formatTimeOnly(b.endTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-slate-600 truncate max-w-[200px]" title={b.purpose}>
                                            {b.purpose || <span className="italic text-slate-400">None</span>}
                                        </td>
                                        <td className="p-4 align-middle">{renderStatusBadge(b.status)}</td>
                                        <td className="p-4 align-middle text-right">
                                            {b.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => openApproveConfirm(b.id)}
                                                        className="inline-flex items-center justify-center rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1.5 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => openRejectModal(b.id)}
                                                        className="inline-flex items-center justify-center rounded-md text-xs font-semibold bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1.5 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                
                {/* Pagination Controls */}
                {!loading && !error && filtered.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`inline-flex items-center justify-center rounded w-8 h-8 text-sm font-medium ${currentPage === page ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            {showApproveConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg border p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Approve Booking</h3>
                        <p className="text-slate-500 text-sm mb-6">Are you sure you want to approve this booking?</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setShowApproveConfirm(false); setApproveId(null); }}
                                className="px-4 py-2 text-sm font-medium rounded-md border text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleApprove}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-xl shadow-lg border p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Reject Booking</h3>
                        <p className="text-slate-500 text-sm mb-3">Please provide a reason for rejecting this booking.</p>
                        <textarea 
                            value={rejectReason} 
                            onChange={(e) => setRejectReason(e.target.value)} 
                            className="w-full min-h-[100px] border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 mb-6"
                            placeholder="Reason for rejection..."
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setShowRejectModal(false); setRejectId(null); setRejectReason(''); }}
                                className="px-4 py-2 text-sm font-medium rounded-md border text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReject}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function formatDateOnly(dateTime) {
    try {
        const d = new Date(dateTime);
        if (isNaN(d)) return dateTime;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateTime;
    }
}

function formatTimeOnly(dateTime) {
    try {
        const d = new Date(dateTime);
        if (isNaN(d)) return dateTime;
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateTime;
    }
}

export default AdminBookings;