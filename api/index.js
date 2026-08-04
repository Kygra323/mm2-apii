let targetQueue = [];

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const body = req.body || {};
        if (body.jobId) {
            const exists = targetQueue.some(t => t.jobId === body.jobId && t.username === body.username);
            if (!exists) {
                targetQueue.push({
                    username: body.username || "Unknown",
                    jobId: body.jobId,
                    item: body.item || "No Items / Unknown",
                    timestamp: new Date().toISOString()
                });
            }
        }
        return res.status(200).json({ success: true, queueLength: targetQueue.length });
    }

    if (req.method === 'GET') {
        const currentTarget = targetQueue.length > 0 ? targetQueue[0] : null;
        return res.status(200).json({ current: currentTarget, queue: targetQueue });
    }

    if (req.method === 'DELETE') {
        if (targetQueue.length > 0) {
            targetQueue.shift();
        }
        return res.status(200).json({ success: true, remaining: targetQueue.length });
    }

    res.status(405).json({ error: 'Method not allowed' });
};
