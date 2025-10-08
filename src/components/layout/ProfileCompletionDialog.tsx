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

interface ProfileCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileCompletionDialog({ open, onOpenChange }: ProfileCompletionDialogProps) {
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
        toast.success('Profile completed successfully!');
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
    <Dialog open={open} onOpenChange={() => {}}>
      <StickyDialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px] backdrop-blur-md bg-white/95 border-white/20 shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="bg-white border-b px-6 py-4 rounded-t-lg flex-shrink-0">
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please complete your profile information to get the most out of your networking experience.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Designer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
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
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-white border-t px-6 py-4 rounded-b-lg flex-shrink-0">
          <Button 
            type="submit" 
            form="profile-form" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                Saving...
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </DialogFooter>
      </StickyDialogContent>
    </Dialog>
  );
}
