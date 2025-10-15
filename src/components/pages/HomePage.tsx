import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Sparkles } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hover Border Gradient Button */}
          <div className="mb-8 flex justify-center">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <SynkicycleLogo />
              <span>Get Started</span>
            </HoverBorderGradient>
          </div>
          
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
        <div className="mt-20 grid md:grid-cols-3 gap-8 container mx-auto">
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

const SynkicycleLogo = () => {
  return (
    <div className="h-4 w-4 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <Sparkles className="h-2.5 w-2.5 text-white" />
    </div>
  );
};
