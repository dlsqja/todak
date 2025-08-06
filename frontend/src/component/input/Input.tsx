import { useState } from 'react';

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function Input({ id = '', label = '', placeholder, value, onChange, disabled = false }: InputProps) {
  return (
    <div className="flex flex-col">
      <div>
        <label htmlFor={id} className="mb-2 block h4  text-black">
          {label}
        </label>
        <div>
          <input
            id={id}
            type="text"
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full h-12 block border-1 rounded-[12px]
                         border-gray-400 py-4 px-5 p text-black 
                         placeholder:text-gray-500
                         ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
