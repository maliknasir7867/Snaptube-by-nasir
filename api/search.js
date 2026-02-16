const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            status: false, 
            error: 'Method not allowed' 
        });
    }

    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                status: false, 
                error: 'Query is required' 
            });
        }

        console.log('Searching for:', query);

        // Your existing API endpoint
        const apiUrl = `https://apis.davidcyril.name.ng/song?query=${encodeURIComponent(query)}`;
        
        const response = await axios.get(apiUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        // Return the exact same format your frontend expects
        return res.status(200).json(response.data);
        
    } catch (error) {
        console.error('Search error:', error.message);
        
        // Return in the same format your frontend expects
        return res.status(500).json({ 
            status: false, 
            error: 'Search failed: ' + error.message 
        });
    }
};
