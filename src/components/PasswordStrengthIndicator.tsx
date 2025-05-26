
import React from 'react';
import { validatePassword } from '@/utils/passwordValidation';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const validation = validatePassword(password);
  
  const requirements = [
    { text: 'At least 8 characters', test: password.length >= 8 },
    { text: 'One uppercase letter', test: /[A-Z]/.test(password) },
    { text: 'One number', test: /[0-9]/.test(password) },
    { text: 'One special character', test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm font-medium text-gray-700">Password requirements:</p>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          {req.test ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
          <span className={req.test ? 'text-green-600' : 'text-red-500'}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthIndicator;
