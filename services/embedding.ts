export async function generateEmbedding(text: string): Promise<number[]> {
  const token = process.env.HF_TOKEN;
  
  if (!token) {
    throw new Error('HF_TOKEN is missing from environment variables. Check your .env file.');
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5",
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
    
    // If it's a list (some models return [[...]]), flatten it
    if (Array.isArray(result) && Array.isArray(result[0])) {
      result = result[0];
    }
    return result as number[];
  } catch (error: any) {
    console.error('HuggingFace Error:', error);
    throw error;
  }
}
