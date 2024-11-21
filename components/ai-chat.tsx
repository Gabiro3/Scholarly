"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

const ChatGPTOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      {/* Open ChatGPT Button */}
      <button
        onClick={handleOpen}
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition focus:outline-none"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* ChatGPT Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl mx-auto p-4">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all shadow-lg"
            >
              Close
            </button>

            {/* ChatGPT Iframe */}
            <iframe
              src="https://chatgpt.com/" /* Replace with your iframe source if customized */
              className="w-full h-[80vh] rounded-lg"
              title="ChatGPT"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTOverlay;
