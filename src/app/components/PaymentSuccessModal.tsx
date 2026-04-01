import { CheckCircle2, Copy, X, Unlock } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  referenceCode: string;
  productUnlocked?: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function PaymentSuccessModal({
  isOpen,
  referenceCode,
  productUnlocked,
  onClose,
  onContinue,
}: PaymentSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUnlockedLabel = (product: string) => {
    const labels: Record<string, string> = {
      platform: "🎯 Platform Access",
      low_guides: "📚 Low-Tier Guides",
      high_guides: "⭐ High-Tier Guides",
      consultation_20min: "💬 20-Minute Consultation",
      consultation_30min: "💬 30-Minute Consultation",
      consultation_60min: "💬 60-Minute Consultation",
    };
    return labels[product] || "Premium Content";
  };

  return (
    <div className="fixed inset-0 z-[150] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border flex flex-col overflow-hidden relative shadow-primary/10">
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Payment Confirmed
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your payment has been successfully processed!
            </p>
          </div>

        {productUnlocked && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
            <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                Access Granted!
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {getUnlockedLabel(productUnlocked)}
              </p>
            </div>
          </div>
        )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Reference Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted p-3 rounded-lg font-mono text-sm font-semibold break-all">
                {referenceCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="flex-shrink-0"
                title="Copy reference code"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Copied to clipboard
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Save your reference code</strong> for your records. You can use it to track your transaction.
            </p>
          </div>

          <Button
            className="w-full"
            onClick={onContinue}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
