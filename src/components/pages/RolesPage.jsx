import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { rolesService } from '@/services/api/rolesService';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    name_c: '',
    description_c: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await rolesService.getAll();
      setRoles(result || []);
    } catch (err) {
      setError('Failed to load roles');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      Name: '',
      name_c: '',
      description_c: ''
    });
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      Name: role.Name || '',
      name_c: role.name_c || '',
      description_c: role.description_c || ''
    });
    setShowModal(true);
  };

  const handleDeleteRole = async (role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name_c || role.Name}"?`)) {
      return;
    }

    try {
      const success = await rolesService.delete(role.Id);
      if (success) {
        setRoles(prev => prev.filter(r => r.Id !== role.Id));
      }
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error('Failed to delete role');
    }
  };

  const handleSaveRole = async () => {
    try {
      setSaving(true);

      let result;
      if (editingRole) {
        result = await rolesService.update(editingRole.Id, formData);
        if (result) {
          setRoles(prev => prev.map(r => r.Id === editingRole.Id ? result : r));
        }
      } else {
        result = await rolesService.create(formData);
        if (result) {
          setRoles(prev => [...prev, result]);
        }
      }

      if (result) {
        setShowModal(false);
        setFormData({
          Name: '',
          name_c: '',
          description_c: ''
        });
      }
    } catch (err) {
      console.error('Error saving role:', err);
      toast.error('Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredRoles = roles.filter(role => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (role.name_c || '').toLowerCase().includes(searchLower) ||
      (role.Name || '').toLowerCase().includes(searchLower) ||
      (role.description_c || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRoles} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Roles & Permissions</h1>
            <p className="text-slate-600">Manage system roles and their permissions</p>
          </div>
          <Button
            onClick={handleAddRole}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Role</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
          />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Roles List */}
      {filteredRoles.length === 0 ? (
        <Empty 
          message={searchTerm ? "No roles match your search" : "No roles created yet"} 
          action={!searchTerm && (
            <Button onClick={handleAddRole} className="mt-4">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Role
            </Button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div key={role.Id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Shield" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {role.name_c || role.Name}
                    </h3>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {role.description_c && (
                  <p className="text-sm text-slate-600">{role.description_c}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Role ID: {role.Id}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500 space-y-1">
                    {role.CreatedOn && (
                      <div>Created: {new Date(role.CreatedOn).toLocaleDateString()}</div>
                    )}
                    {role.ModifiedOn && role.ModifiedOn !== role.CreatedOn && (
                      <div>Modified: {new Date(role.ModifiedOn).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Display Name
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  placeholder="Enter display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role Name
                </label>
                <Input
                  value={formData.name_c}
                  onChange={(e) => handleInputChange('name_c', e.target.value)}
                  placeholder="Enter role name (e.g., admin, manager)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => handleInputChange('description_c', e.target.value)}
                  placeholder="Describe the role and its responsibilities"
                  className="input-field min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    Name: '',
                    name_c: '',
                    description_c: ''
                  });
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRole}
                disabled={saving || (!formData.Name && !formData.name_c)}
                className="flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} />
                    <span>{editingRole ? 'Update Role' : 'Create Role'}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;