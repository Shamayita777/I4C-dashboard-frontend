import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { reportsAPI } from '../services/api';
import { format } from 'date-fns';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  useEffect(() => {
    loadReportDetails();
  }, [id]);

  const loadReportDetails = async () => {
    try {
      const response = await reportsAPI.getById(id);
      setReport(response.data.report);
      setNotes(response.data.notes || []);
      setSelectedStatus(response.data.report.status);
      setSelectedPriority(response.data.report.priority);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await reportsAPI.updateStatus(id, selectedStatus, selectedPriority);
      alert('Status updated successfully');
      loadReportDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await reportsAPI.addNote(id, newNote, 'COMMENT');
      setNewNote('');
      loadReportDetails();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Report not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/reports')}
            className="mr-4 p-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{report.reference_id}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Reported on {format(new Date(report.created_at), 'MMMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Report Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Fraud Medium</label>
                <p className="mt-1 text-sm text-gray-900">{report.fraud_medium}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Incident Type</label>
                <p className="mt-1 text-sm text-gray-900">{report.incident_type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.location_city}, {report.location_state}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Language</label>
                <p className="mt-1 text-sm text-gray-900">{report.language_preference}</p>
              </div>
              
              {report.amount_involved > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Involved</label>
                  <p className="mt-1 text-sm font-bold text-red-600">
                    ₹{report.amount_involved.toLocaleString('en-IN')}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Anonymous Report</label>
                <p className="mt-1 text-sm text-gray-900">{report.anonymous}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {report.incident_description}
              </p>
            </div>
          </div>

          {/* Suspect Information */}
          {(report.suspect_phone || report.suspect_email || report.suspect_upi_id || report.suspect_other_details) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Suspect Information</h2>
              
              <div className="space-y-3">
                {report.suspect_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{report.suspect_phone}</p>
                  </div>
                )}
                
                {report.suspect_email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{report.suspect_email}</p>
                  </div>
                )}
                
                {report.suspect_upi_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">UPI ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{report.suspect_upi_id}</p>
                  </div>
                )}
                
                {report.suspect_account_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{report.suspect_account_number}</p>
                  </div>
                )}
                
                {report.suspect_bank_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{report.suspect_bank_name}</p>
                  </div>
                )}
                
                {report.suspect_website_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website/URL</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a href={report.suspect_website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {report.suspect_website_url}
                      </a>
                    </p>
                  </div>
                )}
                
                {report.suspect_other_details && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Other Details</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {report.suspect_other_details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Case Notes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Case Notes</h2>
            
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add a note..."
              />
              <button
                type="submit"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Note
              </button>
            </form>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{note.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(note.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status Management</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ESCALATED">Escalated</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <button
                onClick={handleStatusUpdate}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* User Contact */}
          {report.phone && report.phone !== 'ANONYMOUS' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reporter Contact</h2>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{report.phone}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Reference ID</label>
                <p className="font-mono text-gray-900">{report.reference_id}</p>
              </div>
              
              <div>
                <label className="text-gray-500">Created At</label>
                <p className="text-gray-900">
                  {format(new Date(report.created_at), 'MMM dd, yyyy HH:mm:ss')}
                </p>
              </div>
              
              {report.updated_at && (
                <div>
                  <label className="text-gray-500">Last Updated</label>
                  <p className="text-gray-900">
                    {format(new Date(report.updated_at), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              )}
              
              {report.evidence_hash && (
                <div>
                  <label className="text-gray-500">Evidence Hash</label>
                  <p className="font-mono text-xs text-gray-900 break-all">
                    {report.evidence_hash}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
