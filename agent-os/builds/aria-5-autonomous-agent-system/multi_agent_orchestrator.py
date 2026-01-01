#!/usr/bin/env python3
"""
Aria 5.0 Multi-Agent Orchestrator

Runs multiple ARIA agents simultaneously, each handling different channels:
- Slack agent
- Email agent  
- Web chat agent
- API agent

Each agent runs in its own async task and processes messages independently.
"""

import asyncio
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Optional

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(name)s] - %(levelname)s - %(message)s",
)
logger = logging.getLogger("multi-agent-orchestrator")


class AgentInstance:
    """Represents a single ARIA agent instance."""
    
    def __init__(self, agent_id: str, agent_type: str, config: dict):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.config = config
        self.agent_brain = None
        self.running = False
        self.message_count = 0
        self.error_count = 0
        
    async def initialize(self):
        """Initialize the agent brain."""
        try:
            from src.agent.brain import AgentBrain, BrandConfig
            
            brand_config = BrandConfig(
                brand_name=self.config.get("brand_name", "MetroFlex"),
                brand_voice=self.config.get("brand_voice", "Professional, energetic, knowledgeable"),
                brand_personality=self.config.get("brand_personality",
                    f"I'm Aria Agent {self.agent_id}, handling {self.agent_type} channel."),
                knowledge_base_collection=self.config.get("chromadb_collection", "metroflex_knowledge"),
                ghl_api_key=os.getenv("GHL_API_KEY", ""),
                ghl_location_id=os.getenv("GHL_LOCATION_ID", ""),
                ghl_pipeline_id=os.getenv("GHL_PIPELINE_ID", ""),
                n8n_webhook_url=os.getenv("N8N_WEBHOOK_URL", ""),
                industry="fitness",
                location="Arlington, TX",
            )
            
            llm_config = {
                "claude_api_key": os.getenv("ANTHROPIC_API_KEY", ""),
                "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
                "grok_api_key": os.getenv("GROK_API_KEY", ""),
            }
            
            claude_key = llm_config["claude_api_key"]
            if claude_key and claude_key != "placeholder" and not claude_key.startswith("sk-ant-api03-placeholder"):
                self.agent_brain = AgentBrain(brand_config, llm_config)
                logger.info(f"Agent {self.agent_id} ({self.agent_type}) initialized")
                return True
            else:
                logger.warning(f"Agent {self.agent_id} - Claude API key not configured")
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize agent {self.agent_id}: {e}", exc_info=True)
            return False
    
    async def process_message(self, message: str, contact_id: str, conversation_id: str) -> Optional[str]:
        """Process a message through the agent."""
        if not self.agent_brain:
            return "Agent not initialized"
        
        try:
            response = await self.agent_brain.process_message(
                message=message,
                contact_id=contact_id,
                conversation_id=conversation_id,
                channel=self.agent_type,
            )
            
            self.message_count += 1
            response_text = response.response_text if hasattr(response, 'response_text') else str(response)
            return response_text
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"Agent {self.agent_id} error processing message: {e}")
            return None
    
    def get_stats(self) -> dict:
        """Get agent statistics."""
        return {
            "agent_id": self.agent_id,
            "agent_type": self.agent_type,
            "running": self.running,
            "message_count": self.message_count,
            "error_count": self.error_count,
            "initialized": self.agent_brain is not None,
        }


class MultiAgentOrchestrator:
    """Orchestrates multiple ARIA agents."""
    
    def __init__(self):
        self.agents: List[AgentInstance] = []
        self.running = False
        self.tasks: List[asyncio.Task] = []
        
    def add_agent(self, agent_id: str, agent_type: str, config: dict = None):
        """Add an agent to the orchestrator."""
        agent = AgentInstance(agent_id, agent_type, config or {})
        self.agents.append(agent)
        logger.info(f"Added agent: {agent_id} ({agent_type})")
    
    async def initialize_all(self):
        """Initialize all agents."""
        logger.info(f"Initializing {len(self.agents)} agents...")
        
        init_tasks = [agent.initialize() for agent in self.agents]
        results = await asyncio.gather(*init_tasks, return_exceptions=True)
        
        initialized = sum(1 for r in results if r is True)
        logger.info(f"Initialized {initialized}/{len(self.agents)} agents")
        
        return initialized
    
    async def start_slack_agent(self, agent: AgentInstance):
        """Start the Slack agent (connects to Slack Events API)."""
        logger.info(f"Starting Slack agent: {agent.agent_id}")
        
        try:
            from src.orchestration.slack_events import get_slack_event_handler, slack_connector
            from src.orchestration.slack_conversation import get_conversation_manager
            from src.orchestration.slack import SlackConnector
            
            handler = get_slack_event_handler()
            manager = get_conversation_manager()
            
            # Set up Slack connector
            bot_token = os.getenv("SLACK_BOT_TOKEN")
            if bot_token:
                slack_notifier = SlackConnector(
                    webhook_urls={
                        "hot_leads": os.getenv("SLACK_WEBHOOK_HOT_LEADS", ""),
                        "escalations": os.getenv("SLACK_WEBHOOK_ESCALATIONS", ""),
                        "new_leads": os.getenv("SLACK_WEBHOOK_NEW_LEADS", ""),
                        "reports": os.getenv("SLACK_WEBHOOK_REPORTS", ""),
                    },
                    bot_token=bot_token,
                )
                handler.set_dependencies(
                    conversation_manager=manager,
                    slack_connector=slack_notifier,
                )
            
            # Connect agent brain
            if agent.agent_brain:
                slack_connector.set_agent_brain(agent.agent_brain)
                logger.info(f"Slack agent {agent.agent_id} connected to AgentBrain")
            
            agent.running = True
            logger.info(f"Slack agent {agent.agent_id} started successfully")
            
            # Keep running (Slack events come via webhook)
            while agent.running:
                await asyncio.sleep(10)
                # Periodically log stats
                if agent.message_count % 10 == 0 and agent.message_count > 0:
                    logger.info(f"Slack agent {agent.agent_id} processed {agent.message_count} messages")
                    
        except Exception as e:
            logger.error(f"Slack agent {agent.agent_id} error: {e}", exc_info=True)
            agent.running = False
    
    async def start_email_agent(self, agent: AgentInstance):
        """Start the email agent (monitors email channel)."""
        logger.info(f"Starting Email agent: {agent.agent_id}")
        agent.running = True
        
        # Email agent would monitor GHL webhooks or email API
        # For now, simulate running
        while agent.running:
            await asyncio.sleep(30)
            logger.debug(f"Email agent {agent.agent_id} monitoring...")
    
    async def start_web_agent(self, agent: AgentInstance):
        """Start the web chat agent (handles web chat)."""
        logger.info(f"Starting Web Chat agent: {agent.agent_id}")
        agent.running = True
        
        # Web chat agent would handle web socket connections
        # For now, simulate running
        while agent.running:
            await asyncio.sleep(30)
            logger.debug(f"Web agent {agent.agent_id} monitoring...")
    
    async def start_api_agent(self, agent: AgentInstance):
        """Start the API agent (handles REST API requests)."""
        logger.info(f"Starting API agent: {agent.agent_id}")
        agent.running = True
        
        # API agent handles REST endpoints (already running via FastAPI)
        # This task just monitors
        while agent.running:
            await asyncio.sleep(30)
            logger.debug(f"API agent {agent.agent_id} monitoring...")
    
    async def start_all(self):
        """Start all agents."""
        logger.info("=" * 70)
        logger.info("ARIA 5.0 MULTI-AGENT ORCHESTRATOR")
        logger.info("=" * 70)
        
        # Initialize all agents
        initialized = await self.initialize_all()
        
        if initialized == 0:
            logger.error("No agents initialized! Check API keys.")
            return
        
        self.running = True
        
        # Start each agent in its own task
        for agent in self.agents:
            if agent.agent_brain:  # Only start initialized agents
                if agent.agent_type == "slack":
                    task = asyncio.create_task(self.start_slack_agent(agent))
                elif agent.agent_type == "email":
                    task = asyncio.create_task(self.start_email_agent(agent))
                elif agent.agent_type == "web":
                    task = asyncio.create_task(self.start_web_agent(agent))
                elif agent.agent_type == "api":
                    task = asyncio.create_task(self.start_api_agent(agent))
                else:
                    logger.warning(f"Unknown agent type: {agent.agent_type}")
                    continue
                
                self.tasks.append(task)
                logger.info(f"Started {agent.agent_type} agent: {agent.agent_id}")
        
        logger.info(f"\n✅ {len(self.tasks)} agents running")
        logger.info("\nAgents are now processing messages...")
        logger.info("Press Ctrl+C to stop\n")
    
    async def stop_all(self):
        """Stop all agents."""
        logger.info("\nStopping all agents...")
        self.running = False
        
        for agent in self.agents:
            agent.running = False
        
        # Wait for tasks to complete
        if self.tasks:
            await asyncio.gather(*self.tasks, return_exceptions=True)
        
        logger.info("All agents stopped")
    
    def get_status(self) -> dict:
        """Get orchestrator status."""
        return {
            "running": self.running,
            "total_agents": len(self.agents),
            "active_agents": sum(1 for a in self.agents if a.running),
            "agents": [agent.get_stats() for agent in self.agents],
        }


async def main():
    """Main entry point."""
    orchestrator = MultiAgentOrchestrator()
    
    # Add agents
    orchestrator.add_agent("slack-1", "slack", {
        "brand_name": "MetroFlex",
        "brand_voice": "Professional, energetic, knowledgeable",
    })
    
    orchestrator.add_agent("email-1", "email", {
        "brand_name": "MetroFlex",
        "brand_voice": "Professional, energetic, knowledgeable",
    })
    
    orchestrator.add_agent("web-1", "web", {
        "brand_name": "MetroFlex",
        "brand_voice": "Professional, energetic, knowledgeable",
    })
    
    orchestrator.add_agent("api-1", "api", {
        "brand_name": "MetroFlex",
        "brand_voice": "Professional, energetic, knowledgeable",
    })
    
    try:
        # Start all agents
        await orchestrator.start_all()
        
        # Keep running until interrupted
        while orchestrator.running:
            await asyncio.sleep(60)
            
            # Print status every minute
            status = orchestrator.get_status()
            logger.info(f"\n📊 Status: {status['active_agents']}/{status['total_agents']} agents active")
            for agent_stats in status['agents']:
                if agent_stats['running']:
                    logger.info(f"  {agent_stats['agent_id']}: {agent_stats['message_count']} messages, {agent_stats['error_count']} errors")
            
    except KeyboardInterrupt:
        logger.info("\nReceived interrupt signal...")
    finally:
        await orchestrator.stop_all()
        logger.info("Multi-agent orchestrator shutdown complete")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)




