/**
 * @file This is a Netlify serverless function that acts as a secure proxy
 * to the Google Gemini API. It hides the API key from the client-side.
 */

exports.handler = async function (event) {
  // 1. Get the prompt sent from the front-end.
  const { prompt } = JSON.parse(event.body);

  // 2. Access the secret API key from Netlify's environment variables.
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    // 3. Call the Google Gemini API from the server-side.
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    // 4. Send the result back to the front-end.
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error("Gemini API call error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
