let latestTarget = {
    username: "Test",
    jobId: "test_job_id",
    timestamp: new Date().toISOString()
};

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
        latestTarget = {
            username: body.username || "Bilinmiyor",
            jobId: body.jobId || "",
            timestamp: new Date().toISOString()
        };
        return res.status(200).json({ success: true, saved: latestTarget });
    }

    if (req.method === 'GET') {
        return res.status(200).json(latestTarget);
    }

    res.status(405).json({ error: 'Method not allowed' });
};
