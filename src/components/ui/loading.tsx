
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = memo(({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-primary border-t-transparent',
      sizeClasses[size],
      className
    )} />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const LoadingScreen = memo(({ message = 'در حال بارگذاری...', className }: LoadingScreenProps) => (
  <div className={cn(
    'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50',
    className
  )}>
    <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
      <LoadingSpinner size="lg" className="mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
      <p className="text-gray-600">لطفا شکیبا باشید...</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

export { LoadingSpinner, LoadingScreen };
