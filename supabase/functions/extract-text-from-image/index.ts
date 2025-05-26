
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data provided');
    }

    // Convert base64 to blob
    const base64Data = image.split(',')[1];
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Use OCR.space API for text extraction
    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    formData.append('file', blob, 'receipt.jpg');
    formData.append('apikey', Deno.env.get('OCR_SPACE_API_KEY') || 'helloworld'); // Free tier key
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    const ocrResult = await ocrResponse.json();
    
    if (!ocrResult.IsErroredOnProcessing && ocrResult.ParsedResults?.length > 0) {
      const extractedText = ocrResult.ParsedResults[0].ParsedText;
      
      // Extract transaction details using simple patterns
      const details = extractTransactionDetails(extractedText);
      
      return new Response(
        JSON.stringify({ success: true, extractedText, details }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Failed to extract text from image');
    }
  } catch (error) {
    console.error('OCR Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractTransactionDetails(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Look for amount patterns
  const amountPatterns = [
    /\$?(\d+\.?\d{0,2})/g,
    /total:?\s*\$?(\d+\.?\d{0,2})/gi,
    /amount:?\s*\$?(\d+\.?\d{0,2})/gi,
  ];
  
  let amount = '';
  for (const pattern of amountPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Get the largest amount found (likely the total)
      const amounts = matches.map(m => parseFloat(m.replace(/[^\d.]/g, ''))).filter(a => !isNaN(a));
      if (amounts.length > 0) {
        amount = Math.max(...amounts).toFixed(2);
        break;
      }
    }
  }
  
  // Look for merchant/description
  let description = '';
  const merchantPatterns = [
    /^([A-Z][A-Za-z\s&]+)$/,
    /([A-Z][A-Za-z\s&]{3,})/,
  ];
  
  for (const line of lines.slice(0, 5)) { // Check first few lines
    for (const pattern of merchantPatterns) {
      const match = line.match(pattern);
      if (match && match[1].length > 3 && !match[1].includes('$')) {
        description = match[1].trim();
        break;
      }
    }
    if (description) break;
  }
  
  // If no merchant found, use first meaningful line
  if (!description) {
    description = lines.find(line => 
      line.length > 3 && 
      !line.includes('$') && 
      !line.match(/^\d+$/) &&
      !line.toLowerCase().includes('receipt')
    ) || '';
  }
  
  return {
    amount: amount || '',
    description: description || 'Receipt transaction',
  };
}
