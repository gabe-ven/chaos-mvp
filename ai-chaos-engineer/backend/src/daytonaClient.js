import { sleep } from './utils/timers.js';

// Daytona configuration
const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
const DAYTONA_API_URL = process.env.DAYTONA_API_URL || 'https://api.daytona.io'; // Default URL

const USE_REAL_DAYTONA = !!DAYTONA_API_KEY;

/**
 * Spins up a Daytona workspace for the given URL/repo
 * Uses real Daytona API if credentials are configured, otherwise uses stub
 */
export async function spinUpWorkspace(url) {
  console.log(`[Daytona] Spinning up workspace for: ${url}`);
  
  if (USE_REAL_DAYTONA) {
    return await spinUpWorkspaceReal(url);
  } else {
    return await spinUpWorkspaceStub(url);
  }
}

/**
 * Real Daytona API integration
 */
async function spinUpWorkspaceReal(url) {
  try {
    console.log(`[Daytona] Using real Daytona API (${DAYTONA_API_URL})...`);
    
    const response = await fetch(`${DAYTONA_API_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DAYTONA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gitUrl: url,
        name: `chaos-test-${Date.now()}`,
        // Add any other Daytona-specific config here
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Daytona API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    console.log(`[Daytona] ✓ Workspace created: ${data.url || data.workspaceUrl}`);
    
    return {
      success: true,
      workspaceId: data.id || data.workspaceId,
      url: data.url || data.workspaceUrl,
      originalUrl: url,
      metadata: data
    };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to create workspace:`, error);
    
    return {
      success: false,
      error: `Failed to spin up workspace: ${error.message}`
    };
  }
}

/**
 * Stub implementation (fallback when no API key)
 */
async function spinUpWorkspaceStub(url) {
  console.log('[Daytona] Using stub (no API key configured)');
  
  try {
    // Simulate workspace creation time
    await sleep(1000);
    
    const workspaceId = `ws-${Date.now()}`;
    const workspaceUrl = `https://workspace-${workspaceId}.daytona.dev`;
    
    console.log(`[Daytona] ✓ Workspace ready (stub): ${workspaceUrl}`);
    
    return {
      success: true,
      workspaceId,
      url: workspaceUrl,
      originalUrl: url
    };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to create workspace:`, error);
    
    return {
      success: false,
      error: `Failed to spin up workspace: ${error.message}`
    };
  }
}

/**
 * Tears down a Daytona workspace
 */
export async function tearDownWorkspace(workspaceId) {
  console.log(`[Daytona] Tearing down workspace: ${workspaceId}`);
  
  if (USE_REAL_DAYTONA) {
    return await tearDownWorkspaceReal(workspaceId);
  } else {
    return await tearDownWorkspaceStub(workspaceId);
  }
}

/**
 * Real Daytona API teardown
 */
async function tearDownWorkspaceReal(workspaceId) {
  try {
    const response = await fetch(`${DAYTONA_API_URL}/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAYTONA_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete workspace: ${response.status}`);
    }

    console.log(`[Daytona] ✓ Workspace destroyed: ${workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to destroy workspace:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Stub teardown
 */
async function tearDownWorkspaceStub(workspaceId) {
  try {
    await sleep(500);
    console.log(`[Daytona] ✓ Workspace destroyed (stub): ${workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to destroy workspace:`, error);
    return { success: false, error: error.message };
  }
}



