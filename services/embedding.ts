export async function generateEmbedding(text: string): Promise<number[]> {
  const token = process.env.HF_TOKEN;
  
  if (!token) {
    throw new Error('HF_TOKEN is missing from environment variables. Check your .env file.');
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2?task=feature-extraction",
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Wait-For-Model": "true"
        },
        method: "POST",
        body: JSON.stringify({ inputs: [text] }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HF Inference Error: ${response.statusText}`);
    }
    
    let result = await response.json();
    // If we wrapped it in an array, it returns a 2D array [[v1, v2...]]
    if (Array.isArray(result) && Array.isArray(result[0])) {
      result = result[0];
    }
    return result as number[];
  } catch (error: any) {
    console.error('HuggingFace Error:', error);
    throw error;
  }
}
