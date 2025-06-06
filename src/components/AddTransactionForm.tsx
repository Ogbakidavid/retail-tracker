import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddTransactionFormProps {
  onTransactionAdded?: () => void;
}

const AddTransactionForm = ({ onTransactionAdded }: AddTransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak your transaction description",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(transcript);
      setIsRecording(false);
      toast({
        title: "Voice captured!",
        description: "Transaction description updated",
      });
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast({
        title: "Voice input failed",
        description: "Please try again or type manually",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingImage(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        try {
          const { data, error } = await supabase.functions.invoke('extract-text-from-image', {
            body: { image: base64Image }
          });

          if (error) throw error;

          if (data.success && data.details) {
            if (data.details.amount) {
              setAmount(data.details.amount);
            }
            if (data.details.description) {
              setDescription(data.details.description);
            }
            
            toast({
              title: "Receipt processed!",
              description: "Transaction details extracted from image",
            });
          } else {
            toast({
              title: "Could not extract details",
              description: "Please enter transaction details manually",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('OCR processing error:', error);
          toast({
            title: "Failed to process image",
            description: "Please try again or enter details manually",
            variant: "destructive"
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File reading error:', error);
      toast({
        title: "Failed to read file",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add transactions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type,
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Transaction saved!",
        description: `${type === 'income' ? 'Income' : 'Expense'} of $${amount} has been recorded`,
      });

      // Reset form
      setAmount('');
      setDescription('');
      
      // Call callback to refresh transactions
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "Error saving transaction",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              onClick={() => setType('expense')}
              className={`${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              onClick={() => setType('income')}
              className={`${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
            >
              Income
            </Button>
          </div>

          {/* Photo Upload for OCR */}
          <div>
            <Label>Receipt Photo (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isProcessingImage ? 'Processing...' : 'Scan Receipt'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a receipt to automatically extract transaction details
            </p>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg"
              required
            />
          </div>

          {/* Description with Voice Input */}
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="flex gap-2">
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this transaction for?"
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={`${isRecording ? 'bg-red-100 border-red-300' : ''}`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 text-red-600" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl"
          >
            {isLoading ? 'Saving...' : 'Save Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
