import asyncio

import dspy
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json
from pathlib import Path


# Read server launch config from .mcp/server.json (if present) so the client can
# auto-start the server using the configured command whenever it connects.
def load_server_params() -> StdioServerParameters:
    cfg_path = Path(".mcp/server.json")
    if cfg_path.exists():
        with cfg_path.open("r", encoding="utf-8") as f:
            cfg = json.load(f)
        command = cfg.get("command", "python")
        args = cfg.get("args", ["dspy_mcp_server.py"])
        env = cfg.get("env")
    else:
        command = "python"
        args = ["dspy_mcp_server.py"]
        env = None

    return StdioServerParameters(command=command, args=args, env=env)

server_params = load_server_params()


class DSPyAirlineCustomerService(dspy.Signature):
    user_request: str = dspy.InputField()
    process_result: str = dspy.OutputField()


async def run(user_request: str):
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()

            dspy_tools = []
            for tool in tools.tools:
                dspy_tools.append(dspy.Tool.from_mcp_tool(session, tool))

            dspy.configure(lm=dspy.LM("openai/gpt-4o-mini"))
            react = dspy.ReAct(DSPyAirlineCustomerService, tools=dspy_tools)
            result = await react.acall(user_request=user_request)
            print(result)


if __name__ == "__main__":
    asyncio.run(run("please help me book a flight from SFO to JFK on 09/01/2025, my name is Adam"))
