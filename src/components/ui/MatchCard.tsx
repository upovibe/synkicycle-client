// src/components/ui/MatchCard.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Eye, 
  Briefcase, 
  Star,
  Users,
  Heart
} from 'lucide-react';
import type { MatchResult } from '@/api/types/matchTypes';
import { ConnectionDialog } from '@/components/layout/ConnectionDialog';

interface MatchCardProps {
  match: MatchResult;
  onViewProfile?: (userId: string) => void;
}

export function MatchCard({ match, onViewProfile }: MatchCardProps) {
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'professional':
        return <Briefcase className="h-3 w-3" />;
      case 'social':
        return <Heart className="h-3 w-3" />;
      case 'both':
        return <Users className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-pink-100 text-pink-800';
      case 'both':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
        {/* User Info Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={match.user.avatar} alt={match.user.name} />
            <AvatarFallback className="bg-primary text-white font-semibold">
              {(match.user.name || match.user.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {match.user.name || 'Anonymous'}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              @{match.user.username || 'no-username'}
            </p>
            {match.user.profession && (
              <p className="text-xs text-gray-500 truncate">
                {match.user.profession}
              </p>
            )}
          </div>
          {match.user.verified && (
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Match Score */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className={`text-sm font-bold ${getMatchScoreColor(match.matchScore)}`}>
              {match.matchScore}%
            </span>
          </div>
          <Progress 
            value={match.matchScore} 
            className="h-2"
          />
        </div>

        {/* Connection Type Badge */}
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className={`text-xs ${getConnectionTypeColor(match.connectionType)}`}
          >
            {getConnectionTypeIcon(match.connectionType)}
            <span className="ml-1 capitalize">{match.connectionType}</span>
          </Badge>
        </div>

        {/* AI Reason */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg">
            "{match.reason}"
          </p>
        </div>

        {/* Interests */}
        {match.user.interests && match.user.interests.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Interests</p>
            <div className="flex flex-wrap gap-1">
              {match.user.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {match.user.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{match.user.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => setShowConnectionDialog(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewProfile?.(match.user.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Connection Dialog */}
      <ConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        targetUser={match.user}
        connectionType={match.connectionType}
      />
    </>
  );
}
