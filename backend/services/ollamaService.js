const axios = require('axios');

/**
 * basic wrapper for calling local ollama instance
 */
const fetchOllamaMatch = async (sysPrompt, userMsg) => {
    try {
        console.log(`[ollama] calling model: ${process.env.OLLAMA_MODEL || "llama3.2"}`);

        const res = await axios.post(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
            model: process.env.OLLAMA_MODEL || "llama3.2",
            system: sysPrompt,
            prompt: userMsg,
            stream: false,
            format: "json",
            options: {
                temperature: 0,
                num_ctx: 3072, // don't push this too high or it'll crash on older gpus
                num_predict: 1024
            }
        }, {
            timeout: 240000 // 4 mins seems enough
        });

        if (res.data?.response) {
            const raw = res.data.response.trim();
            // console.log('debug snippet:', raw.substring(0, 50));
            return JSON.parse(raw);
        }

        throw new Error('empty response');
    } catch (err) {
        // todo: handle retry logic here if needed
        if (err.response?.status === 500) {
            console.error('vram is full, check your gpu');
            throw new Error('your pc is out of memory, try closing some apps');
        }
        throw err;
    }
};

module.exports = { analyzeWithOllama: fetchOllamaMatch };
