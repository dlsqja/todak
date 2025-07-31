import { useState } from 'react';

interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  id = 'label',
  label = '',
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
      <div className="flex flex-col">
        <label htmlFor="username" className="block h4  text-black">
          {label}
        </label>
        <div className="mt-2">
          <input
            id={id}
            type="text"
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-12 block border-1 rounded-[12px]
                         border-gray-400 py-4 px-5 p text-black placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
