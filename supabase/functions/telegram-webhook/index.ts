import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramUpdate {
  message?: {
    text?: string;
    from?: {
      id: number;
      username?: string;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RESEND_API_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Missing configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    const update: TelegramUpdate = await req.json();
    console.log('Received Telegram update:', JSON.stringify(update));

    const messageText = update.message?.text?.trim().toUpperCase();
    if (!messageText) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse command format: "VALID/INVALID/USED {verification_id}"
    const validPattern = /^VALID\s+([a-f0-9-]{36})$/i;
    const invalidPattern = /^INVALID\s+([a-f0-9-]{36})$/i;
    const usedPattern = /^USED\s+([a-f0-9-]{36})$/i;

    let status: string | null = null;
    let verificationId: string | null = null;

    if (validPattern.test(messageText)) {
      status = 'valid';
      verificationId = messageText.match(validPattern)![1];
    } else if (invalidPattern.test(messageText)) {
      status = 'invalid';
      verificationId = messageText.match(invalidPattern)![1];
    } else if (usedPattern.test(messageText)) {
      status = 'used';
      verificationId = messageText.match(usedPattern)![1];
    }

    if (!status || !verificationId) {
      console.log('Message does not match expected format');
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${status} status for verification ${verificationId}`);

    // Fetch the verification record
    const { data: verification, error: fetchError } = await supabase
      .from('gift_card_verifications')
      .select('*')
      .eq('id', verificationId)
      .single();

    if (fetchError || !verification) {
      console.error('Error fetching verification:', fetchError);
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
        `❌ Error: Verification ${verificationId} not found`
      );
      return new Response(JSON.stringify({ error: 'Verification not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update the verification status
    const { error: updateError } = await supabase
      .from('gift_card_verifications')
      .update({
        status,
        admin_result_type: status,
        verified_at: new Date().toISOString(),
      })
      .eq('id', verificationId);

    if (updateError) {
      console.error('Error updating verification:', updateError);
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
        `❌ Error updating verification: ${updateError.message}`
      );
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mask the card number (show only last 4 digits)
    const cardCode = verification.code || '';
    const last4 = cardCode.slice(-4);
    const maskedEnding = `******${last4}`;

    // Send email to user
    const statusText = status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Used';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Dear Customer,</p>
        <p>You have submitted a <strong>${statusText.toLowerCase()}</strong> ${verification.giftcard_name} worth <strong>${verification.amount}</strong> ending with <strong>${maskedEnding}</strong>.</p>
        <p>Best regards,<br/>Gift Card Verification Team</p>
      </div>
    `;

    try {
      const { error: emailError } = await resend.emails.send({
        from: 'Gift Card Verification <onboarding@resend.dev>',
        to: [verification.email],
        subject: `${statusText} Giftcard`,
        html: emailHtml,
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          TELEGRAM_CHAT_ID,
          `⚠️ Verification updated but email failed: ${emailError.message}`
        );
      } else {
        console.log('Email sent successfully');
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          TELEGRAM_CHAT_ID,
          `✅ Verification ${verificationId} marked as ${statusText.toUpperCase()} and email sent to ${verification.email}`
        );
      }
    } catch (emailException) {
      console.error('Exception sending email:', emailException);
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
        `⚠️ Verification updated but email failed: ${emailException.message}`
      );
    }

    return new Response(JSON.stringify({ success: true, status }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in telegram-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length <= 8) {
    return '****' + cardNumber.slice(-4);
  }
  const first4 = cardNumber.slice(0, 4);
  const last4 = cardNumber.slice(-4);
  return `${first4}****${last4}`;
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}
