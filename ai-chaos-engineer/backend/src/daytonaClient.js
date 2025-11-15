import { sleep } from './utils/timers.js';
import { sendLog, sendError } from './realtime.js';

const USE_REAL_DAYTONA = process.env.DAYTONA_API_KEY && process.env.DAYTONA_API_URL;

/**
 * Spins up a Daytona workspace for the given URL/repo
 * Uses real Daytona API if credentials are configured, otherwise uses stub
 */
export async function spinUpWorkspace(url) {
  console.log(`[Daytona] Spinning up workspace for: ${url}`);
  sendLog(`Provisioning Daytona workspace for: ${url}`, 'info');
  
  if (USE_REAL_DAYTONA) {
    sendLog('Using real Daytona API...', 'info');
    return await spinUpWorkspaceReal(url);
  } else {
    sendLog('Using stub Daytona workspace (no API key configured)', 'warning');
    return await spinUpWorkspaceStub(url);
  }
}

/**
 * Real Daytona API integration
 */
async function spinUpWorkspaceReal(url) {
  try {
    console.log('[Daytona] Using real Daytona API...');
    sendLog('Creating workspace via Daytona API...', 'info');
    
    const response = await fetch(`${process.env.DAYTONA_API_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DAYTONA_API_KEY}`,
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
      const errorMsg = `Daytona API error: ${response.status} - ${error}`;
      sendLog(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const workspaceUrl = data.url || data.workspaceUrl;
    
    console.log(`[Daytona] ✓ Workspace created: ${workspaceUrl}`);
    sendLog(`✅ Workspace created: ${workspaceUrl}`, 'success');
    
    return {
      success: true,
      workspaceId: data.id || data.workspaceId,
      url: data.url || data.workspaceUrl,
      originalUrl: url,
      metadata: data
    };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to create workspace:`, error);
    sendError(error, 'Daytona Workspace Creation');
    
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
  sendLog('Simulating workspace creation...', 'info');
  
  try {
    // Simulate workspace creation time
    await sleep(1000);
    
    const workspaceId = `ws-${Date.now()}`;
    const workspaceUrl = `https://workspace-${workspaceId}.daytona.dev`;
    
    console.log(`[Daytona] ✓ Workspace ready (stub): ${workspaceUrl}`);
    sendLog(`✅ Stub workspace ready: ${workspaceUrl}`, 'success');
    
    return {
      success: true,
      workspaceId,
      url: workspaceUrl,
      originalUrl: url
    };
  } catch (error) {
    console.error(`[Daytona] ✗ Failed to create workspace:`, error);
    sendError(error, 'Stub Workspace Creation');
    
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
    const response = await fetch(`${process.env.DAYTONA_API_URL}/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.DAYTONA_API_KEY}`
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



