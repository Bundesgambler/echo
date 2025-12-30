
export interface PromptContext {
    topic: string;
    headlineLine1?: string;
    headlineLine2?: string;
    headlineLine3?: string;
    subline?: string;
    backgroundInfo?: string;
    headlineFixed?: boolean;
    sublineFixed?: boolean;
    includePerson?: boolean;
    personDescription?: string;
}

/**
 * Compresses a base64 image string.
 */
export const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx2d = canvas.getContext('2d');
            ctx2d?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
};

/**
 * Converts a Blob or Object URL to a Base64 string.
 */
export const blobToBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

/**
 * Constructs a standardized prompt for the image generation workflow.
 */
export const constructPrompt = (ctx: PromptContext): string => {
    let prompt = `Topic: ${ctx.topic}\n`;

    const headline = [ctx.headlineLine1, ctx.headlineLine2, ctx.headlineLine3]
        .filter(line => line && line.trim())
        .map((line, idx) => `Line ${idx + 1}: ${line}`)
        .join(', ');

    if (headline) {
        prompt += `Headline: ${headline}${ctx.headlineFixed ? ' (Important: Headline fixed, dont change it)' : ''}\n`;
    }

    if (ctx.subline) {
        prompt += `Subline: ${ctx.subline}${ctx.sublineFixed ? ' (Important: Subline fixed, dont change it)' : ''}\n`;
    }

    prompt += `\nSTRICT FORMATTING RULE: 
- If the user uses quotation marks in the Headline or Subline, YOU MUST include them in the final render. 
- If the user DOES NOT use quotation marks, you are FORBIDDEN from adding them. Use the text exactly as provided.\n`;

    if (ctx.backgroundInfo) {
        prompt += `Background Image Details: ${ctx.backgroundInfo}\n`;
    }

    // Person instructions
    if (ctx.includePerson && ctx.personDescription?.trim()) {
        prompt += `\nPerson to include: ${ctx.personDescription}\n`;
    } else {
        prompt += `\nIMPORTANT: It is forbidden to show any persons in the image.\n`;
    }

    return prompt.trim();
};

/**
 * Formats the headline for the n8n payload.
 */
export const formatHeadline = (l1?: string, l2?: string, l3?: string): string => {
    return [l1, l2, l3]
        .filter(line => line && line.trim())
        .map((line, idx) => `Line ${idx + 1}: ${line}`)
        .join(', ');
};
