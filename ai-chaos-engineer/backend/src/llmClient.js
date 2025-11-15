/**
 * AI Analyzer using OpenAI or Claude API
 * Generates plain-language summary and actionable recommendations
 */

/**
 * Analyzes chaos test results using an LLM
 * @param {Object} testResults - Raw test results from chaos tests
 * @returns {Promise<Object>} - AI-generated summary and recommendations
 */
export async function analyzeResults(testResults) {
  const { tests, workspaceUrl, totalDuration } = testResults;
  
  // Prepare structured data for LLM
  const testSummary = tests.map(t => ({
    name: t.test,
    passed: t.passed,
    duration: t.duration,
    message: t.message,
    severity: t.severity
  }));
  
  const failedTests = tests.filter(t => !t.passed);
  const passedCount = tests.length - failedTests.length;
  
  // Check which API to use (OpenAI or Claude)
  const useOpenAI = process.env.OPENAI_API_KEY;
  const useClaude = process.env.ANTHROPIC_API_KEY;
  
  try {
    if (useOpenAI) {
      return await analyzeWithOpenAI(testSummary, passedCount, failedTests, totalDuration);
    } else if (useClaude) {
      return await analyzeWithClaude(testSummary, passedCount, failedTests, totalDuration);
    } else {
      // Fallback to rule-based analysis if no API key
      return generateFallbackAnalysis(testSummary, passedCount, failedTests, totalDuration);
    }
  } catch (error) {
    console.error('[AI Analyzer] Error:', error.message);
    // Return fallback analysis on error
    return generateFallbackAnalysis(testSummary, passedCount, failedTests, totalDuration);
  }
}

/**
 * Analyze using OpenAI API
 */
async function analyzeWithOpenAI(testSummary, passedCount, failedTests, totalDuration) {
  const prompt = buildPrompt(testSummary, passedCount, failedTests, totalDuration);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert chaos engineer analyzing application resilience test results. Provide concise, actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  const analysis = data.choices[0].message.content;
  
  return parseAnalysis(analysis);
}

/**
 * Analyze using Claude API
 */
async function analyzeWithClaude(testSummary, passedCount, failedTests, totalDuration) {
  const prompt = buildPrompt(testSummary, passedCount, failedTests, totalDuration);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are an expert chaos engineer. ${prompt}`
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  const analysis = data.content[0].text;
  
  return parseAnalysis(analysis);
}

/**
 * Build the prompt for LLM
 */
function buildPrompt(testSummary, passedCount, failedTests, totalDuration) {
  return `Analyze these chaos engineering test results and provide insights:

Tests Run: ${testSummary.length}
Passed: ${passedCount}
Failed: ${failedTests.length}
Total Duration: ${totalDuration}ms

Test Details:
${JSON.stringify(testSummary, null, 2)}

Please provide:
1. A brief 2-3 sentence summary of the overall system resilience
2. 3-5 specific, actionable recommendations to improve stability

Format your response as:
SUMMARY: [your summary]
RECOMMENDATIONS:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]`;
}

/**
 * Parse LLM response into structured format
 */
function parseAnalysis(analysisText) {
  const lines = analysisText.split('\n').filter(l => l.trim());
  
  let summary = '';
  const recommendations = [];
  let inRecommendations = false;
  
  for (const line of lines) {
    if (line.includes('SUMMARY:')) {
      summary = line.replace(/SUMMARY:\s*/i, '').trim();
    } else if (line.includes('RECOMMENDATIONS')) {
      inRecommendations = true;
    } else if (inRecommendations && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))) {
      const rec = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (rec) recommendations.push(rec);
    } else if (inRecommendations && line.trim() && !summary) {
      // Sometimes summary comes after "SUMMARY:" label
      summary = line.trim();
    }
  }
  
  // If parsing fails, try to extract from full text
  if (!summary) {
    summary = analysisText.substring(0, 200).trim();
  }
  
  // If no recommendations found, extract bullet points or numbered items
  if (recommendations.length === 0) {
    const recMatches = analysisText.match(/[-•]\s*(.+?)(?=[-•]|\n\n|$)/g) || 
                       analysisText.match(/\d+\.\s*(.+?)(?=\d+\.|\n\n|$)/g);
    if (recMatches) {
      recMatches.forEach(match => {
        const rec = match.replace(/^[-•\d+\.]\s*/, '').trim();
        if (rec.length > 10) recommendations.push(rec);
      });
    }
  }
  
  return {
    aiSummary: summary || 'Analysis completed. Review test results for details.',
    recommendations: recommendations.length > 0 ? recommendations : [
      'Monitor application performance under load',
      'Review and optimize timeout configurations',
      'Implement comprehensive error handling'
    ]
  };
}

/**
 * Generate fallback analysis using rule-based logic (no API required)
 */
function generateFallbackAnalysis(testSummary, passedCount, failedTests, totalDuration) {
  console.log('[AI Analyzer] Using fallback analysis (no API key configured)');
  
  // Generate summary based on test results
  let summary = '';
  if (passedCount === testSummary.length) {
    summary = 'Excellent! All chaos tests passed. Your application demonstrates strong resilience under various failure scenarios including latency injection, load spikes, and UI validation.';
  } else if (passedCount >= testSummary.length * 0.66) {
    summary = `Good resilience overall with ${passedCount}/${testSummary.length} tests passed. Some areas need attention, particularly in ${failedTests.map(t => t.test.toLowerCase()).join(' and ')}.`;
  } else {
    summary = `Your application needs improvement with only ${passedCount}/${testSummary.length} tests passed. Critical issues detected in ${failedTests.map(t => t.test.toLowerCase()).join(', ')} that may impact production stability.`;
  }
  
  // Generate recommendations based on failed tests
  const recommendations = [];
  
  failedTests.forEach(test => {
    switch (test.test) {
      case 'Latency Injection':
        recommendations.push('Implement proper timeout handling and retry logic for network requests');
        recommendations.push('Add circuit breakers to prevent cascading failures during high latency');
        break;
      case 'Load Spike':
        recommendations.push('Scale your infrastructure to handle traffic spikes (auto-scaling, load balancing)');
        recommendations.push('Implement rate limiting and request queuing to manage concurrent load');
        break;
      case 'UI Check':
        recommendations.push('Improve UI error handling and accessibility standards (ARIA labels, semantic HTML)');
        recommendations.push('Add comprehensive client-side error boundaries and fallback UI states');
        break;
    }
  });
  
  // Add general recommendations
  if (recommendations.length === 0) {
    recommendations.push('Continue monitoring application performance in production');
    recommendations.push('Set up alerting for performance degradation and error rate increases');
    recommendations.push('Run chaos tests regularly to catch regressions early');
  } else {
    recommendations.push('Integrate chaos testing into your CI/CD pipeline for continuous validation');
  }
  
  // Limit to 5 recommendations
  return {
    aiSummary: summary,
    recommendations: recommendations.slice(0, 5)
  };
}

