import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userProfilesService } from '@/services/api/userProfilesService';

const UserProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    first_name_c: '',
    last_name_c: '',
    phone_number_c: '',
    address_c: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real scenario, you might fetch by user ID
      // For now, we'll get the first profile or create one
      const profiles = await userProfilesService.getAll();
      
      if (profiles && profiles.length > 0) {
        const userProfile = profiles[0];
        setProfile(userProfile);
        setFormData({
          Name: userProfile.Name || '',
          first_name_c: userProfile.first_name_c || '',
          last_name_c: userProfile.last_name_c || '',
          phone_number_c: userProfile.phone_number_c || '',
          address_c: userProfile.address_c || ''
        });
      } else {
        // No profile exists, user can create one
        setProfile(null);
        setFormData({
          Name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
          first_name_c: user?.firstName || '',
          last_name_c: user?.lastName || '',
          phone_number_c: '',
          address_c: ''
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let result;
      if (profile?.Id) {
        // Update existing profile
        result = await userProfilesService.update(profile.Id, formData);
      } else {
        // Create new profile
        result = await userProfilesService.create(formData);
      }

      if (result) {
        setProfile(result);
        setIsEditing(false);
        toast.success(profile?.Id ? 'Profile updated successfully' : 'Profile created successfully');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        Name: profile.Name || '',
        first_name_c: profile.first_name_c || '',
        last_name_c: profile.last_name_c || '',
        phone_number_c: profile.phone_number_c || '',
        address_c: profile.address_c || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">User Profile</h1>
            <p className="text-slate-600">Manage your personal information and preferences</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Edit" size={16} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="card p-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {formData.first_name_c && formData.last_name_c 
                ? `${formData.first_name_c.charAt(0)}${formData.last_name_c.charAt(0)}`
                : formData.Name 
                ? formData.Name.charAt(0).toUpperCase()
                : <ApperIcon name="User" size={24} />
              }
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {formData.first_name_c && formData.last_name_c 
                  ? `${formData.first_name_c} ${formData.last_name_c}`
                  : formData.Name || 'No Name Set'
                }
              </h2>
              <p className="text-slate-600">{user?.emailAddress || 'No email available'}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Display Name
              </label>
              <Input
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <Input
                value={formData.first_name_c}
                onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <Input
                value={formData.last_name_c}
                onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <Input
                value={formData.phone_number_c}
                onChange={(e) => handleInputChange('phone_number_c', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
                type="tel"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address_c}
                onChange={(e) => handleInputChange('address_c', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter address"
                className="input-field min-h-[100px] resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
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
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Profile Information */}
          {profile && !isEditing && (
            <div className="pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Created:</span>
                  <span className="ml-2 text-slate-900">
                    {profile.CreatedOn ? new Date(profile.CreatedOn).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Last Modified:</span>
                  <span className="ml-2 text-slate-900">
                    {profile.ModifiedOn ? new Date(profile.ModifiedOn).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;