import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt } = await req.json();
    const apiKey = Deno.env.get('GROQ_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({ text: 'API key not configured.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    const data = await groqResponse.json();
    const text = data.choices?.[0]?.message?.content || 'No response generated.';

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ text: 'Error: ' + error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
