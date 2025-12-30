
import { N8nPayload } from '../types';

const WEBHOOK_URL = 'https://n8n.mariohau.de/webhook/5001781d-c9be-4ef7-8635-4d241a6e8a9a';

/**
 * Triggers the n8n workflow and extracts the resulting image.
 * Handles both raw binary streams and JSON-wrapped base64 data.
 */
export const triggerWorkflow = async (payload: N8nPayload, webhookUrl: string): Promise<string> => {
  let response: Response;

  // Create an AbortController to handle timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

  try {
    // We use standard fetch. If this fails with a 'Failed to fetch' error, 
    // it's almost certainly a CORS issue or a blocked request by the browser/server.
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (e: any) {
    if (e.name === 'AbortError') {
      console.error("Uplink Timeout Error: Request took longer than 5 minutes");
      throw new Error("Connection Timeout: The image generation took too long (over 5 minutes). Please try again or check n8n logs.");
    }
    console.error("Uplink Connection Error:", e);
    // Provide a more descriptive error message to the user
    throw new Error(`Connection Failed: ${e.message || 'The server might be blocking the request (CORS) or the URL is incorrect.'}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `Server Error (${response.status})`;

    try {
      const parsedError = JSON.parse(errorBody);
      if (parsedError.message && parsedError.message.includes("Unused Respond to Webhook node")) {
        errorMessage = "N8N CONFIG ERROR: The 'Respond to Webhook' node is present but not active. Ensure 'Response Mode' is set to 'When Last Node Finishes'.";
      } else {
        errorMessage = parsedError.message || errorMessage;
      }
    } catch (e) {
      errorMessage = errorBody || errorMessage;
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type') || '';

  // If the server returns JSON (common if it's wrapping base64)
  if (contentType.includes('application/json')) {
    const result = await response.json();
    const item = Array.isArray(result) ? result[0] : result;

    // Standard n8n binary structure
    if (item.binary?.data?.data) {
      const mime = item.binary.data.mimeType || 'image/png';
      return `data:${mime};base64,${item.binary.data.data}`;
    }

    // Direct data string
    if (item.data && typeof item.data === 'string' && item.data.startsWith('data:image')) {
      return item.data;
    }

    // Fallback data structure
    if (item.binary?.data && typeof item.binary.data === 'string') {
      return `data:image/png;base64,${item.binary.data}`;
    }

    throw new Error("Workflow completed, but no image payload was found. Check the n8n 'Respond to Webhook' node output.");
  }

  // If the server returns raw binary data
  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("The server returned an empty binary file.");
  }

  return URL.createObjectURL(blob);
};
