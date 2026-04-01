import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Lock, X, Loader2 } from "lucide-react";

interface PaymentModalProps {
  url: string | null;
  referenceCode?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({ url, referenceCode, onClose, onSuccess }: PaymentModalProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PESAPAL_PAYMENT_COMPLETE') {
        if (onSuccess) onSuccess();
        else window.location.href = '/dashboard?payment=complete';
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess]);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden relative shadow-primary/10">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary"/> 
            Secure Payment
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 relative bg-white">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-muted-foreground z-10">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading secure PesaPal checkout...</p>
            </div>
          )}
          <iframe 
            src={url} 
            className={`w-full h-full border-0 absolute inset-0 z-20 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
}
