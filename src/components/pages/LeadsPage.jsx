import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import LeadModal from '@/components/organisms/LeadModal';
import leadsService from '@/services/api/leadsService';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800', 
    'Qualified': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadsService.getAll();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleDeleteLead = async (leadId) => {
    if (!confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      setActionLoading(leadId);
      await leadsService.delete(leadId);
      setLeads(prev => prev.filter(lead => lead.Id !== leadId));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete lead');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      setActionLoading(leadId);
      await leadsService.updateStatus(leadId, newStatus);
      setLeads(prev => prev.map(lead => 
        lead.Id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast.success('Lead status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update lead status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (selectedLead) {
        const updatedLead = await leadsService.update(selectedLead.Id, leadData);
        setLeads(prev => prev.map(lead => 
          lead.Id === selectedLead.Id ? updatedLead : lead
        ));
        toast.success('Lead updated successfully');
      } else {
        const newLead = await leadsService.create(leadData);
        setLeads(prev => [newLead, ...prev]);
        toast.success('Lead created successfully');
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save lead');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <Button onClick={handleAddLead} className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Lead</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search leads by name, email, or company..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <Empty
          icon="Mail"
          title="No leads found"
          description={searchQuery || statusFilter !== 'All' 
            ? "No leads match your current filters." 
            : "Get started by adding your first lead."
          }
          actionText="Add Lead"
          onAction={handleAddLead}
        />
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <div key={lead.Id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {lead.name}
                    </h3>
                    <Badge className={statusColors[lead.status] || 'bg-gray-100 text-gray-800'}>
                      {lead.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" className="w-4 h-4" />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.companyName && (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Building2" className="w-4 h-4" />
                        <span>{lead.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.Id, e.target.value)}
                    disabled={actionLoading === lead.Id}
                    className="text-sm px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLead(lead)}
                    disabled={actionLoading === lead.Id}
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteLead(lead.Id)}
                    disabled={actionLoading === lead.Id}
                    className="text-red-600 hover:text-red-700"
                  >
                    {actionLoading === lead.Id ? (
                      <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    ) : (
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setShowModal(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
};

export default LeadsPage;