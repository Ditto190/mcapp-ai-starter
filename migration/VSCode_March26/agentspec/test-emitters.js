const fs = require('fs');
const path = require('path');
const { Parser } = require('./dist/compiler/parser');
const { MCPServerEmitter } = require('./dist/emitters/mcp-server');
const { WorkflowEmitter } = require('./dist/emitters/workflow');
const { CollectionEmitter } = require('./dist/emitters/collection');
const { SkillLibraryEmitter } = require('./dist/emitters/skill-library');

console.log('🧪 Testing all emitters and writing files...\n');

// Read example file
const examplePath = './examples/python-mcp-expert.agentspec';
const content = fs.readFileSync(examplePath, 'utf-8');

// Parse
const parser = new Parser();
const result = parser.parse(examplePath, content);

if (result.diagnostics.length > 0) {
  console.error('❌ Parse errors:', result.diagnostics);
  process.exit(1);
}

const agent = result.source.agents[0];
console.log('✅ Parsed agent:', agent.name);
console.log('   Decorators:', agent.decorators.length);
console.log('   Fields:', agent.fields.length);
console.log();

const outputDir = './test-verify';
let totalFiles = 0;
let totalBytes = 0;

// Helper function to write files
function writeFiles(files, emitterName) {
  const fileArray = Array.isArray(files) ? files : [files];
  console.log(`${emitterName}: Generated ${fileArray.length} file(s)`);
  for (const file of fileArray) {
    const outputPath = path.join(outputDir, file.path);
    const outputDirectoryPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirectoryPath)) {
      fs.mkdirSync(outputDirectoryPath, { recursive: true });
    }
    fs.writeFileSync(outputPath, file.content, 'utf-8');
    console.log(`   ✅ ${file.path} (${file.content.length} bytes, kind: ${file.kind})`);
    totalFiles++;
    totalBytes += file.content.length;
  }
}

// Test MCPServerEmitter
console.log('📦 Testing MCPServerEmitter...');
try {
  const mcp = new MCPServerEmitter();
  const mcpFiles = mcp.emit(agent);
  writeFiles(mcpFiles, '   ');
} catch (e) {
  console.error('   ❌ Error:', e.message, e.stack);
}
console.log();

// Test WorkflowEmitter
console.log('🔄 Testing WorkflowEmitter...');
try {
  const workflow = new WorkflowEmitter();
  const workflowFile = workflow.emit(agent);
  writeFiles(workflowFile, '   ');
} catch (e) {
  console.error('   ❌ Error:', e.message, e.stack);
}
console.log();

// Test CollectionEmitter
console.log('📚 Testing CollectionEmitter...');
try {
  const collection = new CollectionEmitter();
  const collectionFile = collection.emit(agent);
  writeFiles(collectionFile, '   ');
} catch (e) {
  console.error('   ❌ Error:', e.message, e.stack);
}
console.log();

// Test SkillLibraryEmitter
console.log('💪 Testing SkillLibraryEmitter...');
try {
  const skill = new SkillLibraryEmitter();
  const skillFile = skill.emit(agent);
  writeFiles(skillFile, '   ');
} catch (e) {
  console.error('   ❌ Error:', e.message, e.stack);
}
console.log();

console.log('✨ All emitters tested and files written successfully!');
console.log(`📊 Summary: ${totalFiles} files, ${totalBytes} bytes total`);
console.log(`📁 Output directory: ${outputDir}`);

