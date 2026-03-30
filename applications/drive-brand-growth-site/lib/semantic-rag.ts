/**
 * Semantic RAG Engine for Drive Brand Growth
 *
 * World-class two-stage retrieval system:
 * 1. Bi-encoder semantic search (fast, broad recall)
 * 2. Cross-encoder reranking (accurate, precise)
 *
 * Uses OpenAI embeddings + Anthropic Claude for generation
 */

import { KNOWLEDGE_BASE, KnowledgeChunk } from './knowledge-base';

// ============================================
// TYPES
// ============================================

export interface EmbeddedChunk extends KnowledgeChunk {
  embedding: number[];
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  rerankScore?: number;
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  technicalDepth: 'L1' | 'L2' | 'L3';
  conversationHistory?: { role: string; content: string }[];
}

export interface RAGResponse {
  answer: string;
  sources: { id: string; content: string; score: number }[];
  confidence: number;
  tokensUsed?: number;
}

// ============================================
// EMBEDDING CACHE (In-memory for serverless)
// ============================================

let embeddingCache: Map<string, number[]> = new Map();
let knowledgeEmbeddings: EmbeddedChunk[] | null = null;

// ============================================
// COSINE SIMILARITY
// ============================================

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================
// OPENAI EMBEDDINGS
// ============================================

async function getEmbedding(text: string): Promise<number[]> {
  // Check cache first
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback to simple TF-IDF-like embedding for development
    return getFallbackEmbedding(text);
  }

  try {
    // Add timeout using AbortController (5 second timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[RAG] OpenAI embedding error:', await response.text());
      return getFallbackEmbedding(text);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;

    // Cache the embedding
    embeddingCache.set(text, embedding);

    return embedding;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('[RAG] Embedding request timed out, using fallback');
    } else {
      console.error('[RAG] Embedding request failed:', error);
    }
    return getFallbackEmbedding(text);
  }
}

// ============================================
// FALLBACK EMBEDDING (for development without API key)
// ============================================

function getFallbackEmbedding(text: string): number[] {
  // Simple bag-of-words embedding with 384 dimensions
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const embedding = new Array(384).fill(0);

  for (const word of words) {
    // Hash word to embedding dimensions
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 31 + word.charCodeAt(i)) % 384;
    }
    embedding[hash] += 1;
  }

  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }
  }

  return embedding;
}

// ============================================
// INITIALIZE KNOWLEDGE BASE EMBEDDINGS
// ============================================

// Initialization promise to prevent concurrent initialization
let initializationPromise: Promise<EmbeddedChunk[]> | null = null;

async function initializeKnowledgeEmbeddings(): Promise<EmbeddedChunk[]> {
  // Return cached embeddings if available
  if (knowledgeEmbeddings) {
    return knowledgeEmbeddings;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    console.log('[RAG] Initializing knowledge base embeddings (parallel)...');
    const startTime = Date.now();

    // Parallel embedding with batching (10 concurrent requests max)
    const BATCH_SIZE = 10;
    const embedded: EmbeddedChunk[] = [];

    for (let i = 0; i < KNOWLEDGE_BASE.length; i += BATCH_SIZE) {
      const batch = KNOWLEDGE_BASE.slice(i, i + BATCH_SIZE);
      const embeddings = await Promise.all(
        batch.map(chunk => getEmbedding(chunk.content))
      );

      batch.forEach((chunk, idx) => {
        embedded.push({
          ...chunk,
          embedding: embeddings[idx],
        });
      });
    }

    knowledgeEmbeddings = embedded;
    const elapsed = Date.now() - startTime;
    console.log(`[RAG] Embedded ${embedded.length} chunks in ${elapsed}ms`);

    return embedded;
  })();

  return initializationPromise;
}

// ============================================
// STAGE 1: SEMANTIC SEARCH (Bi-encoder)
// ============================================

export async function semanticSearch(
  query: string,
  options: {
    topK?: number;
    category?: KnowledgeChunk['metadata']['category'];
    technicalDepth?: 'L1' | 'L2' | 'L3';
  } = {}
): Promise<SearchResult[]> {
  const { topK = 10, category, technicalDepth } = options;

  // Get query embedding
  const queryEmbedding = await getEmbedding(query);

  // Get knowledge embeddings
  const chunks = await initializeKnowledgeEmbeddings();

  // Filter and score
  const results: SearchResult[] = [];

  for (const chunk of chunks) {
    // Apply filters
    if (category && chunk.metadata.category !== category) continue;

    // Technical depth filtering: show content at user's level or below
    if (technicalDepth) {
      const depthOrder = { L1: 1, L2: 2, L3: 3 };
      if (depthOrder[chunk.metadata.technicalDepth] > depthOrder[technicalDepth]) {
        continue; // Skip content above user's technical level
      }
    }

    // Calculate similarity
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);

    results.push({
      chunk: {
        id: chunk.id,
        content: chunk.content,
        metadata: chunk.metadata,
      },
      score,
    });
  }

  // Sort by score and return top K
  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

// ============================================
// STAGE 2: RERANKING (Cross-encoder simulation)
// ============================================

async function rerankResults(
  query: string,
  results: SearchResult[],
  topK: number = 5
): Promise<SearchResult[]> {
  // In production, this would use a cross-encoder model
  // For now, we'll use keyword boosting + semantic score combination

  const queryTerms = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  const reranked = results.map(result => {
    const contentLower = result.chunk.content.toLowerCase();

    // Exact keyword match bonus
    let keywordBonus = 0;
    for (const term of queryTerms) {
      if (contentLower.includes(term)) {
        keywordBonus += 0.1;
      }
    }

    // Metadata keyword match bonus
    for (const keyword of result.chunk.metadata.keywords) {
      if (queryTerms.some(term => keyword.includes(term) || term.includes(keyword))) {
        keywordBonus += 0.15;
      }
    }

    // Combine semantic score with keyword bonus
    const rerankScore = result.score * 0.7 + Math.min(keywordBonus, 0.3);

    return {
      ...result,
      rerankScore,
    };
  });

  return reranked.sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0)).slice(0, topK);
}

// ============================================
// TWO-STAGE RETRIEVAL
// ============================================

export async function retrieveWithReranking(
  query: string,
  options: {
    initialK?: number;
    finalK?: number;
    category?: KnowledgeChunk['metadata']['category'];
    technicalDepth?: 'L1' | 'L2' | 'L3';
  } = {}
): Promise<SearchResult[]> {
  const { initialK = 10, finalK = 5, category, technicalDepth } = options;

  // Stage 1: Broad semantic search
  const initialResults = await semanticSearch(query, {
    topK: initialK,
    category,
    technicalDepth,
  });

  // Stage 2: Precise reranking
  const rerankedResults = await rerankResults(query, initialResults, finalK);

  return rerankedResults;
}

// ============================================
// CONTEXT ASSEMBLY
// ============================================

export function buildRAGContext(
  query: string,
  results: SearchResult[],
  technicalDepth: 'L1' | 'L2' | 'L3',
  maxTokens: number = 2000
): string {
  let context = '';
  let estimatedTokens = 0;

  for (const result of results) {
    const chunkTokens = Math.ceil(result.chunk.content.length / 4); // Rough estimate

    if (estimatedTokens + chunkTokens > maxTokens) break;

    context += `[Source: ${result.chunk.metadata.category}/${result.chunk.metadata.subcategory || 'general'}]\n`;
    context += result.chunk.content + '\n\n';
    estimatedTokens += chunkTokens;
  }

  return context.trim();
}

// ============================================
// LLM GENERATION (Claude)
// ============================================

export async function generateRAGResponse(
  context: RAGContext
): Promise<RAGResponse> {
  const { query, results, technicalDepth, conversationHistory = [] } = context;

  // Build context from retrieved results
  const retrievedContext = buildRAGContext(query, results, technicalDepth);

  // Build conversation context
  const historyContext = conversationHistory
    .slice(-6) // Last 6 messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  // Determine response style based on technical depth
  const styleGuide = {
    L1: 'Use simple, business-focused language. Focus on outcomes and ROI. Avoid technical jargon.',
    L2: 'Use moderate technical language. Include implementation details but explain concepts. Balance technical and business value.',
    L3: 'Use technical language freely. Include architecture details, code patterns, and engineering specifics. Assume strong technical background.',
  }[technicalDepth];

  // Build system prompt
  const systemPrompt = `You are the Revenue Intelligence system for Drive Brand Growth, an AI consulting firm that builds production-grade AI systems for revenue operations.

RESPONSE STYLE: ${styleGuide}

GUIDELINES:
- Be concise and direct. No fluff.
- If information is in the context, cite it. If not, say you don't have that specific information.
- Focus on what DBG can do for the prospect.
- When appropriate, guide toward booking a technical walkthrough.
- Never make up specific numbers, pricing, or timelines not in the context.
- Use markdown formatting for lists and emphasis.

CONTEXT FROM KNOWLEDGE BASE:
${retrievedContext}

${historyContext ? `CONVERSATION HISTORY:\n${historyContext}\n` : ''}`;

  // Check for Claude API key
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    return await generateWithClaude(systemPrompt, query, anthropicKey, results);
  } else if (openaiKey) {
    return await generateWithOpenAI(systemPrompt, query, openaiKey, results);
  } else {
    // Fallback to template-based response
    return generateFallbackResponse(query, results, technicalDepth);
  }
}

// ============================================
// CLAUDE GENERATION
// ============================================

async function generateWithClaude(
  systemPrompt: string,
  query: string,
  apiKey: string,
  results: SearchResult[]
): Promise<RAGResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514', // Sonnet 4.5 for enterprise conversations requiring thought and depth
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: query }],
      }),
    });

    if (!response.ok) {
      console.error('[RAG] Claude error:', await response.text());
      return generateFallbackResponse(query, results, 'L1');
    }

    const data = await response.json();
    const answer = data.content[0]?.text || '';

    return {
      answer,
      sources: results.slice(0, 3).map(r => ({
        id: r.chunk.id,
        content: r.chunk.content.substring(0, 200) + '...',
        score: r.rerankScore || r.score,
      })),
      confidence: results[0]?.score || 0,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    };
  } catch (error) {
    console.error('[RAG] Claude request failed:', error);
    return generateFallbackResponse(query, results, 'L1');
  }
}

// ============================================
// OPENAI GENERATION (GPT-4)
// ============================================

async function generateWithOpenAI(
  systemPrompt: string,
  query: string,
  apiKey: string,
  results: SearchResult[]
): Promise<RAGResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and cost-effective
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[RAG] OpenAI error:', await response.text());
      return generateFallbackResponse(query, results, 'L1');
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || '';

    return {
      answer,
      sources: results.slice(0, 3).map(r => ({
        id: r.chunk.id,
        content: r.chunk.content.substring(0, 200) + '...',
        score: r.rerankScore || r.score,
      })),
      confidence: results[0]?.score || 0,
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    console.error('[RAG] OpenAI request failed:', error);
    return generateFallbackResponse(query, results, 'L1');
  }
}

// ============================================
// FALLBACK RESPONSE (No API key)
// ============================================

function generateFallbackResponse(
  query: string,
  results: SearchResult[],
  technicalDepth: 'L1' | 'L2' | 'L3'
): RAGResponse {
  // Use top result as basis for response
  if (results.length === 0) {
    return {
      answer: `I don't have specific information about that in my knowledge base. For detailed questions about our services, I'd recommend booking a technical walkthrough with Noel—he can address your specific situation directly.\n\n**Ready to book?** Click the button above or email noel@drivebrandgrowth.com`,
      sources: [],
      confidence: 0,
    };
  }

  const topResult = results[0];
  const relevantContent = topResult.chunk.content;

  // Construct response from top results
  let answer = relevantContent;

  // Add follow-up based on category
  if (topResult.chunk.metadata.category === 'pricing') {
    answer += '\n\nFor an accurate quote based on your specific requirements, let\'s schedule a technical walkthrough.';
  } else if (topResult.chunk.metadata.category === 'services') {
    answer += '\n\nWant to see how this would work for your specific situation? Book a technical walkthrough with Noel.';
  }

  return {
    answer,
    sources: results.slice(0, 3).map(r => ({
      id: r.chunk.id,
      content: r.chunk.content.substring(0, 200) + '...',
      score: r.rerankScore || r.score,
    })),
    confidence: topResult.score,
  };
}

// ============================================
// MAIN RAG PIPELINE
// ============================================

export async function runRAGPipeline(
  query: string,
  options: {
    technicalDepth?: 'L1' | 'L2' | 'L3';
    conversationHistory?: { role: string; content: string }[];
    category?: KnowledgeChunk['metadata']['category'];
  } = {}
): Promise<RAGResponse> {
  const { technicalDepth = 'L1', conversationHistory = [], category } = options;

  console.log(`[RAG] Query: "${query.substring(0, 50)}..." | Depth: ${technicalDepth}`);

  // Stage 1 & 2: Retrieve with reranking
  const results = await retrieveWithReranking(query, {
    initialK: 10,
    finalK: 5,
    technicalDepth,
    category,
  });

  console.log(`[RAG] Retrieved ${results.length} results | Top score: ${results[0]?.score.toFixed(3) || 'N/A'}`);

  // Stage 3: Generate response
  const response = await generateRAGResponse({
    query,
    results,
    technicalDepth,
    conversationHistory,
  });

  return response;
}
