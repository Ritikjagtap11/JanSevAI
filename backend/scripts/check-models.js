require('dotenv').config();
const axios = require('axios');

async function checkOllama() {
    console.log('\n--- Checking Ollama (Primary AI) ---');
    try {
        const response = await axios.get(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/tags`);
        console.log('Installed Ollama Models:');
        response.data.models.forEach(m => console.log(` - ${m.name}`));
    } catch (error) {
        console.error('Ollama not running or unreachable at', process.env.OLLAMA_BASE_URL);
    }
}

checkOllama();
