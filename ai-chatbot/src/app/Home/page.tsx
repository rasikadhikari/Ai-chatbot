import { Smoke } from "@/components/ui/shadcn-io/smoke";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/ui/pricing/page";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Smoke background */}
      <Smoke className="absolute inset-0 z-0" />

      {/* Content container with navbar */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Main Content Section */}
        <div className="flex flex-col items-center justify-center grow text-center text-white px-4 py-16">
          <h1 className="text-6xl font-bold mb-4">
            Welcome to our AI-powered Chatbot
          </h1>
          <p className="text-xl max-w-4xl mb-6">
            Experience seamless, intelligent conversations with our advanced
            chatbot designed to assist, engage, and provide instant solutions to
            your queries. Whether you need support, information, or just a
            friendly chat, our AI is here to help 24/7, making your interactions
            smarter and more efficient.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex gap-4 mb-12">
            <Button className="bg-gray-200 text-black p-5 gap-2 m-2">
              Explore
            </Button>
            <Button className="bg-gray-200 text-black p-5 gap-2 m-2">
              Get Started
            </Button>
          </div>

          {/* Pricing Section */}
          <div className="w-full bg-gray-100 py-16" id="pricing">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800">
                Pricing Plans
              </h2>
              <p className="text-xl text-gray-600 mt-4">
                Choose a plan that fits your needs and start your AI-powered
                experience today.
              </p>
            </div>
            <Pricing />
          </div>
        </div>
      </div>
    </div>
  );
}
