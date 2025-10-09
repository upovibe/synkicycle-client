// src/components/pages/MatchesPage.tsx

import { MatchCard } from '@/components/ui/MatchCard';
import { Button } from '@/components/ui/button';
import { useMatchStore } from '@/api/stores/matchStore';
import { 
  RefreshCw, 
  Users, 
  Filter, 
  Sparkles,
  TrendingUp,
  UserCheck,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoaderOne } from '@/components/ui/loader';

export function MatchesPage() {
  const { matches, loading, error, fetchMatches } = useMatchStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'professional' | 'social' | 'both'>('all');

  const filteredMatches = matches.filter(match => {
    if (activeFilter === 'all') return true;
    return match.connectionType === activeFilter;
  });

  const getFilterStats = () => {
    const stats = {
      all: matches.length,
      professional: matches.filter(m => m.connectionType === 'professional').length,
      social: matches.filter(m => m.connectionType === 'social').length,
      both: matches.filter(m => m.connectionType === 'both').length,
    };
    return stats;
  };

  const stats = getFilterStats();

  // Load matches on mount
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <LoaderOne />
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Matches</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchMatches}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Matches
          </h1>
          <p className="text-gray-600 mt-1">
            Discover your next professional connections powered by AI
          </p>
        </div>
        <Button 
          onClick={fetchMatches}
          disabled={loading}
          className="shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Matches</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.all}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Professional</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.professional}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span className="text-sm font-medium text-gray-600">Social</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.social}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Both</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.both}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Matches ({stats.all})
        </Button>
        <Button
          variant={activeFilter === 'professional' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('professional')}
        >
          Professional ({stats.professional})
        </Button>
        <Button
          variant={activeFilter === 'social' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('social')}
        >
          Social ({stats.social})
        </Button>
        <Button
          variant={activeFilter === 'both' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('both')}
        >
          Both ({stats.both})
        </Button>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Found</h3>
          <p className="text-gray-600 mb-4">
            {activeFilter === 'all' 
              ? "We couldn't find any matches for you right now. Try refreshing or check back later."
              : `No ${activeFilter} matches found. Try a different filter.`
            }
          </p>
          <Button onClick={fetchMatches} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden md:block">Refreshing...</span>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden md:block">Refresh Matches</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.user.id}
              match={match}
            />
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <LoaderOne />
        </div>
      )}
    </div>
  );
}
