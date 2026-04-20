import React, { useEffect, useState } from 'react';
import BookingFormModal from '../BookingFormModal';
import { getBookingsByUserId, cancelBooking } from '../../../services/BookingService';
import ResourceService from '../../../services/ResourceService';
import { Calendar, Clock, CheckCircle2, XCircle, FileEdit, Trash2, Plus } from 'lucide-react';

const TEMP_USER_ID = 1;

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [editBooking, setEditBooking] = useState(null);
    const [cancelId, setCancelId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const refreshBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const [bookingsRes, resourcesRes] = await Promise.all([
                getBookingsByUserId(TEMP_USER_ID),
                ResourceService.getAllResources(),
            ]);

            const resourceMap = Object.fromEntries(
                (resourcesRes.data || []).map((r) => [r.id, r.name])
            );

            setBookings(
                bookingsRes.data.map((b) => ({
                    ...b,
                    resourceName: resourceMap[b.resourceId] || 'Unknown Resource',
                }))
            );
        } catch {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshBookings();
    }, []);

    const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage));
    const paginated = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleModalConfirm = async () => {
        if (!cancelId) return;
        try {
            await cancelBooking(cancelId);
            setShowModal(false);
            setCancelId(null);
            refreshBookings();
        } catch {
            alert('Failed to cancel booking.');
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
        setCancelId(null);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[500px] text-muted-foreground">Loading bookings...</div>;
    if (error) return <div className="flex items-center justify-center min-h-[500px] text-destructive">{error}</div>;

    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const approved = bookings.filter((b) => b.status === 'APPROVED').length;
    const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

    const renderStatusBadge = (status) => {
        const lower = status?.toLowerCase() || '';
        if (lower === 'approved') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1"/>Approved</span>;
        if (lower === 'pending') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/>Pending</span>;
        if (lower === 'rejected') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/>Rejected</span>;
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
                    <p className="text-muted-foreground mt-1 text-slate-500">View and manage your resource bookings</p>
                </div>
                <button 
                    onClick={() => setShowBookingModal(true)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-slate-900 text-white shadow hover:bg-slate-800 h-10 px-6 py-2"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Resource
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded border bg-white text-slate-900 p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Total Bookings</h3>
                        <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <div><div className="text-3xl font-bold">{total}</div></div>
                </div>
                <div className="rounded border bg-white text-slate-900 p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Pending</h3>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div><div className="text-3xl font-bold text-amber-600">{pending}</div></div>
                </div>
                <div className="rounded border bg-white text-slate-900 p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Approved</h3>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div><div className="text-3xl font-bold text-emerald-600">{approved}</div></div>
                </div>
                <div className="rounded border bg-white text-slate-900 p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500">Rejected</h3>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div><div className="text-3xl font-bold text-red-600">{rejected}</div></div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 pb-4 border-b">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-slate-50/50">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Resource</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Purpose</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Date & Time</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 hover:text-slate-700">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-slate-500 hover:text-slate-700 w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 text-slate-700">
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No bookings found.</td>
                                </tr>
                            )}
                            {paginated.map((b) => (
                                <tr key={b.id} className="border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-50">
                                    <td className="p-4 align-middle font-medium text-slate-900">{b.resourceName}</td>
                                    <td className="p-4 align-middle text-slate-600">{b.purpose || <span className="text-slate-400 italic">Not specified</span>}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span>{formatDateOnly(b.startTime)}</span>
                                            <span className="text-xs text-slate-500">{formatTimeOnly(b.startTime)} - {formatTimeOnly(b.endTime)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{renderStatusBadge(b.status)}</td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2 text-slate-400">
                                            <button 
                                                onClick={() => { setEditBooking(b); setShowBookingModal(true); }}
                                                className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit Booking"
                                            >
                                                <FileEdit className="w-4 h-4" />
                                            </button>
                                            {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                                                <button 
                                                    onClick={() => { setCancelId(b.id); setShowModal(true); }}
                                                    className="p-2 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && !error && bookings.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, bookings.length)}</span> of <span className="font-medium">{bookings.length}</span> results
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

            {/* Modals */}
            {showBookingModal && (
                <BookingFormModal
                    onClose={() => { setShowBookingModal(false); setEditBooking(null); }}
                    onBooked={refreshBookings}
                    booking={editBooking}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded border p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Cancel Booking</h3>
                        <p className="text-slate-500 text-sm mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={handleModalCancel}
                                className="px-4 py-2 text-sm font-medium rounded-md border text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Keep Booking
                            </button>
                            <button 
                                onClick={handleModalConfirm}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Yes, Cancel it
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
        return new Date(dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateTime;
    }
}

function formatTimeOnly(dateTime) {
    try {
        return new Date(dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateTime;
    }
}

export default MyBookings;