let latestTarget = {
    username: null,
    jobId: null,
    timestamp: null
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { username, jobId } = req.body;

        if (!username || !jobId) {
            return res.status(400).json({ error: 'Eksik bilgi (username veya jobId yok)' });
        }

        latestTarget = {
            username: username,
            jobId: jobId,
            timestamp: new Date().toISOString()
        };

        console.log(`Yeni hedef kaydedildi: ${username} | JobID: ${jobId}`);
        return res.status(200).json({ success: true, message: 'Hedef kaydedildi!' });
    }

    if (req.method === 'GET') {
        return res.status(200).json(latestTarget);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
