import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Sparkles } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

export function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect, Network, and Grow
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The professional networking platform that helps you build meaningful connections 
            and advance your career through AI-powered matching and intelligent conversations.
          </p>
        </div>

        {/* Tablet Animation */}
        <div className="mt-16">
          <ContainerScroll />
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI-powered matching algorithm connects you with professionals who share your interests and goals.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Intelligent Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI assistant helps you craft perfect messages and provides networking advice.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Career Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Build meaningful professional relationships that advance your career and open new opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
