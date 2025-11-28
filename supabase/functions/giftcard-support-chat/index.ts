import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // If action is 'send_summary', handle Telegram notification
    if (action === 'send_summary') {
      const summary = messages[messages.length - 1].content;
      console.log('Sending summary to Telegram:', summary);
      
      // Send to Telegram via existing notification function
      const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
      
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const telegramMessage = `🤖 *Gift Card Support Chat Summary*\n\n${summary}`;
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // System prompt for the gift card support assistant
    const systemPrompt = `You are a professional Gift Card Support Assistant for GiftcardsHub. Your role is to help users with gift card inquiries in a friendly, professional manner.

**Your conversation flow:**
1. Greet the user warmly
2. Ask which gift card brand they need help with (e.g., Amazon, Steam, iTunes, etc.)
3. Ask what they want to do:
   - Buy a gift card
   - Sell a gift card
   - Verify a gift card
   - Check balance
   - General question
4. Ask for the card value/amount
5. Ask for their country and email for verification

**You help users with:**
- General questions about gift cards
- How to verify, buy, or sell gift cards on our platform
- Checking gift card balances
- Explaining where codes are located on different gift cards
- Our rates, payment methods, and supported countries
- Can ask for codes/PINs to help check them

**Important:**
- Keep replies SHORT and CLEAR (2-3 sentences max)
- Be FRIENDLY and PROFESSIONAL
- Ask ONE question at a time
- After collecting: name (optional), gift card brand, card value, code, country, and email, provide a summary

**Gift card code locations:**
- Physical cards: Usually on the back under a scratch-off panel or sticker
- E-gift cards: In the email, often labeled as "Claim Code" or "Gift Card Number"
- Most cards have both a card number (long) and PIN (4-6 digits)

**Our services:**
- We verify gift cards typically within 1 hour
- We buy and sell gift cards at competitive rates
- We support multiple countries (US, CA, UK, AU, EU countries)
- Payment via credit card for exchanges

Be conversational and helpful. Guide users through the process step by step.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service temporarily unavailable." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in giftcard-support-chat:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
