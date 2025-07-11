import React, { useState } from 'react';
import { StepProps } from '@/src/types/onboarding';
import { Button } from '@/src/components/ui/button';
import Switch  from '@/src/components/ui/switch';


interface ToggleRowProps {
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  disablePush: boolean;
  onChange: (field: 'email' | 'push', value: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, email, push, disablePush, onChange }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-gray-100 shadow-sm">
    <div className="mb-3">
      <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-1">{label}</h4>
      <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs lg:text-sm font-medium text-gray-700">Email notifications</span>
        <Switch 
          checked={email} 
          onCheckedChange={(v) => onChange('email', v)}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs lg:text-sm font-medium ${
          disablePush ? 'text-gray-400' : 'text-gray-700'
        }`}>
          SMS notifications
          {disablePush && <span className="text-xs text-gray-400 block">Phone number required</span>}
        </span>
        <Switch 
          checked={push} 
          disabled={disablePush} 
          onCheckedChange={(v) => onChange('push', v)}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>
    </div>
  </div>
);

const NotificationPreferencesStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const phoneAvailable = Boolean(data.phoneNumber && data.phoneNumber.trim());
  const [prefs, setPrefs] = useState({
    updatesSavedPropertiesEmail: data.updatesSavedPropertiesEmail ?? true,
    updatesSavedPropertiesPush: phoneAvailable ? (data.updatesSavedPropertiesPush ?? true) : false,
    newPropertiesEmail: data.newPropertiesEmail ?? true,
    newPropertiesPush: phoneAvailable ? (data.newPropertiesPush ?? true) : false,
    newsEmail: data.newsEmail ?? true,
    newsPush: phoneAvailable ? (data.newsPush ?? true) : false,
  });

  const handleToggle = (keyBase: string, field: 'email' | 'push', value: boolean) => {
    const key = `${keyBase}${field === 'email' ? 'Email' : 'Push'}` as keyof typeof prefs;
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    onUpdate(prefs);
    onNext?.();
  };

  const notificationTypes = [
    {
      key: 'updatesSavedProperties',
      label: 'Property Updates',
      description: 'Get notified when saved properties have price changes, new photos, or status updates',
      email: prefs.updatesSavedPropertiesEmail,
      push: prefs.updatesSavedPropertiesPush
    },
    {
      key: 'newProperties',
      label: 'New Property Matches',
      description: 'Receive alerts for new properties that match your preferences and search criteria',
      email: prefs.newPropertiesEmail,
      push: prefs.newPropertiesPush
    },
    {
      key: 'news',
      label: 'Rentora Updates',
      description: 'Stay informed about new features, market insights, and important platform updates',
      email: prefs.newsEmail,
      push: prefs.newsPush
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="text-center mb-4 lg:mb-5">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3">Notification Preferences</h3>
        <p className="text-sm lg:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          Choose how you&apos;d like to stay updated with the latest property information and platform news
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-3 lg:space-y-4">
        {notificationTypes.map((type) => (
          <ToggleRow
            key={type.key}
            label={type.label}
            description={type.description}
            email={type.email}
            push={type.push}
            disablePush={!phoneAvailable}
            onChange={(field, val) => handleToggle(type.key, field, val)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 lg:pt-5 max-w-lg mx-auto">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="h-9 md:h-10 lg:h-11 px-4 lg:px-6 text-sm lg:text-base font-medium rounded-lg border-2 hover:bg-gray-50 transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="h-9 md:h-10 lg:h-11 px-6 lg:px-8 text-sm lg:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesStep; 