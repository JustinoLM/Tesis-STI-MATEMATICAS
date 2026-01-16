/**
 * Estado de error reutilizable.
 */

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-4"
            >
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
