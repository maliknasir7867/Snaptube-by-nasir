const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, type } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const decodedUrl = decodeURIComponent(url);
        console.log('Downloading:', type);
        
        // Security: Allow only YouTube-related domains
        const allowedDomains = [
            'apis.davidcyril.name.ng',
            'youtube.com',
            'ytimg.com',
            'googlevideo.com',
            'rr1---sn-n4v7knlr.googlevideo.com',
            'rr2---sn-n4v7knlr.googlevideo.com',
            'rr3---sn-n4v7knlr.googlevideo.com',
            'rr4---sn-n4v7knlr.googlevideo.com',
            'rr5---sn-n4v7knlr.googlevideo.com'
        ];
        
        try {
            const urlObj = new URL(decodedUrl);
            const isDomainAllowed = allowedDomains.some(domain => 
                urlObj.hostname.includes(domain)
            );
            
            if (!isDomainAllowed) {
                console.log('Blocked domain:', urlObj.hostname);
                return res.status(403).json({ error: 'Domain not allowed' });
            }
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // Fetch the file
        const response = await axios({
            method: 'GET',
            url: decodedUrl,
            responseType: 'stream',
            timeout: 30000,
            maxContentLength: 50 * 1024 * 1024,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Referer': 'https://www.youtube.com/'
            }
        });

        // Generate filename
        const filename = type === 'mp3' 
            ? `audio_${Date.now()}.mp3` 
            : `video_${Date.now()}.mp4`;

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', type === 'mp3' ? 'audio/mpeg' : 'video/mp4');
        res.setHeader('Cache-Control', 'no-cache');

        // Stream the file
        response.data.pipe(res);

    } catch (error) {
        console.error('Download error:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Download failed: ' + error.message });
        }
    }
};
