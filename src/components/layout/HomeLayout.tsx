import { cn } from "@/lib/utils";
import { ContainerScroll } from "../ui/container-scroll-animation";

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-20">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="text-center mb-8 z-10 relative px-4 md:px-20">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
          AI Networking
          <span className="text-primary block">Companion</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect, collaborate, and grow your professional network with the power of AI.
        </p>
      </div>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll />
      </div>
    </div>
  );
}
