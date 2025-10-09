"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  Network,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { useNavigate, Link } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { ProfileCompletionDialog } from "@/components/layout/ProfileCompletionDialog";
import { ProfileViewDialog } from "@/components/layout/ProfileViewDialog";

interface NetworkHubLayoutProps {
  children: React.ReactNode
}

export default function NetworkHubLayout({ children }: NetworkHubLayoutProps) {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showProfileViewDialog, setShowProfileViewDialog] = useState(false);

  // Check if profile is incomplete
  const isProfileIncomplete = user && (!user.name || !user.username);

  // Show profile dialog when user is logged in but profile is incomplete
  useEffect(() => {
    if (isProfileIncomplete) {
      setShowProfileDialog(true);
    }
  }, [isProfileIncomplete]);

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      const result = await logout();
      console.log('Logout result:', result);
      if (result.success) {
        toast.success('Logged out successfully');
        navigate({ to: '/auth/login' });
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const links = [
    {
      label: "Network Hub",
      href: "/network",
      icon: (
        <Network className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "AI Matches",
      href: "/network/matches",
      icon: (
        <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: handleLogout,
    },
  ];
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen", // Full screen height for the network hub
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {bottomLinks.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            <div className="mt-4">
              <SidebarLink
                link={{
                  label: user?.name || user?.username || 'User',
                  href: "#",
                  icon: (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                      {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  ),
                  onClick: () => setShowProfileViewDialog(true),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col bg-white p-2 md:p-10 dark:bg-neutral-900">
          {children}
        </div>
      </div>
      
      {/* Profile Completion Dialog */}
      <ProfileCompletionDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
      
      {/* Profile View Dialog */}
      <ProfileViewDialog 
        open={showProfileViewDialog} 
        onOpenChange={setShowProfileViewDialog} 
      />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Synkicycle
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

