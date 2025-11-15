"""
Browser Use Service - AI-Powered Browser Automation
Provides real-time streaming of browser actions
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from browser_use import Agent, Browser, ChatBrowserUse
from pydantic import BaseModel
import asyncio
import os
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

app = FastAPI(title="Browser Use Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

class UICheckRequest(BaseModel):
    url: str
    task: str = "Check this website for UI issues, broken links, console errors, and accessibility problems. Be thorough."

@app.get("/health")
async def health():
    return {"status": "ok", "service": "browser-use"}

@app.post("/ui-check")
async def ui_check(request: UICheckRequest):
    """
    Synchronous UI check endpoint (for backward compatibility)
    """
    try:
        result = await run_ui_check(request.url, request.task)
        return result
    except Exception as e:
        return {
            "passed": False,
            "message": f"UI check failed: {str(e)}",
            "details": {"error": str(e)}
        }

async def run_ui_check(url: str, task: str):
    """
    Run comprehensive UI check with Browser Use AI agent (headless by default)
    """
    # Notify start
    await manager.broadcast({
        "type": "browser_action",
        "action": "initializing",
        "message": "Launching AI browser agent",
        "timestamp": datetime.now().isoformat()
    })
    
    try:
        # Initialize browser in headless mode (no visible window)
        # Always headless for production - no browser window will open
        browser = Browser(
            headless=True,  # Force headless mode
        )
        
        await manager.broadcast({
            "type": "browser_action",
            "action": "browser_ready",
            "message": f"Browser initialized - navigating to {url}",
            "timestamp": datetime.now().isoformat()
        })
        
        # Initialize LLM (Browser Use Cloud or OpenAI)
        if os.getenv("BROWSER_USE_API_KEY"):
            llm = ChatBrowserUse()
            await manager.broadcast({
                "type": "browser_action",
                "action": "llm_ready",
                "message": "AI model loaded",
                "timestamp": datetime.now().isoformat()
            })
        else:
            # Fallback to other LLMs
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(model="gpt-4")
            await manager.broadcast({
                "type": "browser_action",
                "action": "llm_ready",
                "message": "Using OpenAI GPT-4",
                "timestamp": datetime.now().isoformat()
            })
        
        # Create custom callback for streaming actions
        class StreamingCallback:
            async def on_action(self, action: str, details: dict):
                await manager.broadcast({
                    "type": "browser_action",
                    "action": action,
                    "details": details,
                    "timestamp": datetime.now().isoformat()
                })
        
        # Create agent with comprehensive task
        comprehensive_task = f"""
        Comprehensively analyze this website: {url}
        
        Your mission:
        1. Navigate to the page and verify it loads
        2. Check for console errors or warnings
        3. Test navigation links (click at least 3 links)
        4. Look for broken images or missing resources
        5. Check form fields and inputs
        6. Test buttons and interactive elements
        7. Verify mobile responsiveness indicators
        8. Check for accessibility issues
        9. Look for any error messages or warnings on page
        10. Assess overall user experience
        
        Report everything you find, both good and bad.
        """
        
        agent = Agent(
            task=comprehensive_task,
            llm=llm,
            browser=browser,
        )
        
        await manager.broadcast({
            "type": "browser_action",
            "action": "agent_ready",
            "message": "Starting comprehensive analysis",
            "timestamp": datetime.now().isoformat()
        })
        
        # Run agent with streaming (AI will take actions and we'll broadcast them)
        await manager.broadcast({
            "type": "browser_action",
            "action": "navigating",
            "message": f"Navigating to {url}",
            "timestamp": datetime.now().isoformat()
        })
        
        history = await agent.run()
        
        await manager.broadcast({
            "type": "browser_action",
            "action": "analysis_complete",
            "message": "Analysis complete - processing results",
            "timestamp": datetime.now().isoformat()
        })
        
        # Extract results and broadcast each action
        issues_found = []
        actions_taken = []
        positive_findings = []
        
        for idx, step in enumerate(history):
            if hasattr(step, 'action'):
                action_str = str(step.action)
                actions_taken.append(action_str)
                
                # Broadcast each action with more context
                await manager.broadcast({
                    "type": "browser_action",
                    "action": "ai_action",
                    "message": action_str,
                    "timestamp": datetime.now().isoformat()
                })
            
            if hasattr(step, 'result') and step.result:
                result_str = str(step.result)
                result_lower = result_str.lower()
                
                # Categorize findings
                if any(keyword in result_lower for keyword in ['error', 'broken', 'issue', 'problem', 'fail', 'not working', 'missing']):
                    issues_found.append(result_str)
                    await manager.broadcast({
                        "type": "browser_action",
                        "action": "issue_found",
                        "message": f"Issue: {result_str[:100]}",
                        "timestamp": datetime.now().isoformat()
                    })
                elif any(keyword in result_lower for keyword in ['working', 'good', 'ok', 'success', 'loaded']):
                    positive_findings.append(result_str)
                    await manager.broadcast({
                        "type": "browser_action",
                        "action": "positive_finding",
                        "message": result_str[:100],
                        "timestamp": datetime.now().isoformat()
                    })
        
        # Close browser
        await browser.close()
        
        # Determine if passed
        passed = len(issues_found) == 0 or (len(positive_findings) > len(issues_found) * 2)
        
        # Final summary
        summary_message = f"Analysis complete: {len(actions_taken)} actions, {len(issues_found)} issues, {len(positive_findings)} checks passed"
        
        await manager.broadcast({
            "type": "browser_action",
            "action": "complete",
            "message": summary_message,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "passed": passed,
            "message": f"AI found {len(issues_found)} issues" if not passed else f"Site looks healthy - {len(positive_findings)} checks passed",
            "details": {
                "issues": issues_found[:10],  # Top 10 issues
                "positive_findings": positive_findings[:10],  # Top 10 positive
                "actions": actions_taken[:20],  # Top 20 actions
                "total_issues": len(issues_found),
                "total_positive": len(positive_findings),
                "total_actions": len(actions_taken),
                "ai_powered": True,
                "comprehensive": True,
                "headless": os.getenv("BROWSER_LIVE") != "true"
            }
        }
        
    except Exception as e:
        await manager.broadcast({
            "type": "browser_action",
            "action": "error",
            "message": f"Error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        })
        raise

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time browser action streaming
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            
            if data == "ping":
                await websocket.send_json({"type": "pong"})
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3002))
    print(f"🚀 Browser Use Service starting on http://localhost:{port}")
    print(f"📡 WebSocket available at ws://localhost:{port}/ws")
    uvicorn.run(app, host="0.0.0.0", port=port)

