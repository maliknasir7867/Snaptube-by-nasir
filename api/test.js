module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ 
        status: 'ok', 
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
    });
};
