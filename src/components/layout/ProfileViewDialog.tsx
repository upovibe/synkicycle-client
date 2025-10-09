"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  StickyDialogContent,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/providers/AuthProvider";
import { useAuthStore } from "@/api/stores/authStore";
import toast from "react-hot-toast";
import { Edit, Mail, Phone, Briefcase, Calendar, CheckCircle, X, User, AtSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileViewDialog({ open, onOpenChange }: ProfileViewDialogProps) {
  const { user } = useAuthContext();
  const { updateProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    profession: user?.profession || '',
    interests: user?.interests || [],
  });
  const [interestInput, setInterestInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addInterest = () => {
    const trimmedInterest = interestInput.trim();
    if (trimmedInterest && !formData.interests.includes(trimmedInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, trimmedInterest],
      });
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((interest: string) => interest !== interestToRemove),
    });
  };

  const handleInterestKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <StickyDialogContent
        size="lg"
        className="backdrop-blur-md bg-white/95 border-white/20 shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="bg-white border-b px-6 py-4 rounded-t-lg flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-medium">
              {(user.name || user.username || 'U').charAt(0).toUpperCase()}
            </div>
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-4">
              {/* Email - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Name - Editable */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Username - Editable */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-gray-500" />
                  Username *
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  required
                />
              </div>

              {/* Phone - Editable */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            
            <div className="space-y-4">
              {/* Profession - Editable */}
              <div className="space-y-2">
                <Label htmlFor="profession" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  Profession
                </Label>
                <Input
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer, Designer"
                />
              </div>

              {/* Bio - Editable */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-gray-500" />
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Interests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={handleInterestKeyPress}
                  placeholder="Add an interest (press Enter)"
                  className="flex-1"
                />
                <Button type="button" onClick={addInterest} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-primary/70 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Information - Read Only */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Account Status</p>
                  <p className="text-sm text-gray-900">
                    {user.verified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {user.lastActive && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Active</p>
                    <p className="text-sm text-gray-900">
                      {new Date(user.lastActive).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-white border-t px-6 py-4 rounded-b-lg flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="profile-edit-form" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Saving...
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </StickyDialogContent>
    </Dialog>
  );
}
