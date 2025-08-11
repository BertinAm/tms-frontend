import React from "react";
import Link from "next/link";

const SidebarWidget: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">TMS Pro</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            PRO
          </span>
        </div>
        <p className="text-xs text-white/80 mb-3">
          Upgrade to TMS Pro for advanced features and priority support.
        </p>
        <Link
          href="https://tms.com/pricing"
          className="block w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded text-center transition-colors duration-200"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
};

export default SidebarWidget;
