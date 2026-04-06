const { parseAgentSpec } = require('./dist/compiler/parser');
const { VsCodeAgentEmitter } = require('./dist/emitters/vscode-agent-fixed');
const fs = require('fs');
const path = require('path');

try {
  console.log('Reading example file...');
  const content = fs.readFileSync('examples/python-mcp-expert.agentspec', 'utf-8');
  console.log('Content length:', content.length);
  
  console.log('Parsing...');
  const result = parseAgentSpec(content);
  console.log('Parse diagnostics:', result.diagnostics.length);
  console.log('Agents found:', result.source?.agents.length || 0);
  
  if (result.source && result.source.agents.length > 0) {
    const agent = result.source.agents[0];
    console.log('Agent name:', agent.name);
    console.log('Agent fields:', agent.fields.length);
    
    console.log('Emitting...');
    const emitter = new VsCodeAgentEmitter();
    const output = emitter.emit(agent);
    console.log('Output path:', output.path);
    console.log('Output content length:', output.content.length);
    
    const outPath = path.join('test-output', output.path);
    fs.mkdirSync('test-output', { recursive: true });
    fs.writeFileSync(outPath, output.content);
    console.log('✅ File written:', outPath);
    console.log('File exists:', fs.existsSync(outPath));
  }
} catch (err) {
  console.error('Error:', err.message);
  console.error(err.stack);
}
