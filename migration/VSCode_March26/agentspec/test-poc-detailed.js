const { Parser } = require('./dist/compiler/parser');
const { VsCodeAgentEmitter } = require('./dist/emitters/vscode-agent-fixed');
const fs = require('fs');
const path = require('path');

console.log('=== AGENTSPEC POC TEST ===');

try {
  // Step 1: Read file
  const filePath = 'examples/python-mcp-expert.agentspec';
  console.log(`1. Reading: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`   ✓ Read ${content.length} bytes`);
  console.log(`   Content preview: ${content.substring(0, 80).replace(/\n/g, '\\n')}...`);
  
  // Step 2: Parse
  console.log('2. Parsing...');
  const parser = new Parser();
  const result = parser.parse(filePath, content);
  console.log(`   Diagnostics: ${result.diagnostics.length}`);
  
  if (result.diagnostics.length > 0) {
    console.log('   Errors:');
    for (const d of result.diagnostics) {
      console.log(`     - Line ${d.location?.line || '?'}: ${d.message}`);
    }
    process.exit(1);
  }
  
  console.log(`   ✓ Agents parsed: ${result.source?.agents?.length || 0}`);
  
  // Step 3: List agents
  if (result.source && result.source.agents.length > 0) {
    for (const agent of result.source.agents) {
      console.log(`   - Agent: ${agent.name}`);
      console.log(`     Decorators: ${agent.decorators?.length || 0}`);
      console.log(`     Fields: ${agent.fields?.length || 0}`);
    }
  }
  
  // Step 4: Emit
  console.log('3. Emitting...');
  const emitter = new VsCodeAgentEmitter();
  for (const agent of result.source.agents) {
    const file = emitter.emit(agent);
    console.log(`   ✓ Emit result:`);
    console.log(`     Path: ${file.path}`);
    console.log(`     Content length: ${file.content?.length || 0} bytes`);
    console.log(`     Kind: ${file.kind}`);
    
    // Step 5: Write
    console.log('4. Writing...');
    const outputDir = 'test-output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`   ✓ Created directory: ${outputDir}`);
    }
    
    const outputPath = path.join(outputDir, file.path);
    fs.writeFileSync(outputPath, file.content, 'utf-8');
    console.log(`   ✓ Written: ${outputPath}`);
    
    // Verify
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`   ✓ Verified: ${stats.size} bytes`);
    }
  }
  
  console.log('\n✅ POC SUCCESSFUL!');
  
} catch (err) {
  console.error('\n❌ ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
}
