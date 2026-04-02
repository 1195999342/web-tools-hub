'use client';

import React, { useState, useRef, useCallback } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = activeTab ?? internalActive;

  const handleSelect = useCallback(
    (tabId: string) => {
      setInternalActive(tabId);
      onTabChange?.(tabId);
    },
    [onTabChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      handleSelect(tabs[nextIndex].id);
    },
    [tabs, handleSelect],
  );

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={['flex border-b border-gray-200', className].filter(Boolean).join(' ')}
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === current;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={[
              'px-4 py-2 text-sm font-medium min-h-[44px] min-w-[44px] transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isActive
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
