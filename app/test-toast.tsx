'use client';

import React from 'react';
import { useToast } from './ToastContainer';

export default function TestToast() {
  const { showToast } = useToast();

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Toast Test Page</h1>
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => showToast('This is an info toast', 'info')}
      >
        Show Info Toast
      </button>
      
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => showToast('Success! Your payment was processed', 'success')}
      >
        Show Success Toast
      </button>
      
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => showToast('Error! Something went wrong', 'error')}
      >
        Show Error Toast
      </button>
    </div>
  );
} 