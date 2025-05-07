import { useState, useEffect } from "react";
import { Code, Rocket, Clock, Construction } from "lucide-react";

export default function FeatureUnderDevelopment() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress over time
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 md:p-12 shadow-2xl border border-white border-opacity-20 w-full max-w-xl z-10 relative">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg">
            <Construction size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-4">
          Feature Under Development
        </h1>

        <p className="text-blue-100 text-lg text-center mb-8">
          We're working hard to bring you something amazing. Stay tuned!
        </p>

        <div className="space-y-6 mb-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <Rocket className="text-blue-300 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium">Coming Soon</h3>
              <p className="text-blue-100 text-sm">
                This exciting new feature will be available in the next update
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <Clock className="text-blue-300 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium">Expected Release</h3>
              <p className="text-blue-100 text-sm">
                We're targeting launch within the next few weeks
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <Code className="text-blue-300 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium">Development Progress</h3>
              <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all px-6 py-3 rounded-lg text-white font-medium border border-white border-opacity-20">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
}
