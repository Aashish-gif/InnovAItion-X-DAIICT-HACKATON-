export const calculateBudget = (req, res) => {
    try {
        const { budget, storage } = req.body;

        // Parse inputs
        const monthlyBudget = parseFloat(budget) || 0;
        const storageGB = parseFloat(storage) || 0;

        // Pricing Data (Simplified for this implementation)
        // In a real app, this could be fetched from a database or AWS Price List API periodically.
        const SERVICE_DATA = {
            compute: [
                { name: "AWS Lambda", price: 5, minBudget: 0, maxBudget: 50, desc: "Serverless compute, perfect for low-traffic or event-driven apps." },
                { name: "EC2 t3.micro", price: 8, minBudget: 20, maxBudget: 100, desc: "Smallest general purpose instance for lightweight apps." },
                { name: "EC2 t3.medium", price: 30, minBudget: 100, maxBudget: 500, desc: "Reliable compute for production web servers." },
                { name: "ECS Fargate", price: 45, minBudget: 300, maxBudget: 10000, desc: "Container orchestration without managing servers." },
            ],
            database: [
                { name: "DynamoDB (Free Tier)", price: 0, minBudget: 0, maxBudget: 40, desc: "NoSQL database with no upfront cost for small loads." },
                { name: "RDS db.t3.micro", price: 15, minBudget: 40, maxBudget: 150, desc: "Managed relational database for small projects." },
                { name: "RDS db.t3.small", price: 35, minBudget: 150, maxBudget: 500, desc: "Production-ready managed relational database." },
                { name: "Amazon Aurora", price: 70, minBudget: 500, maxBudget: 10000, desc: "High-performance specialized database for scale." },
            ],
            s3_per_gb: 0.023
        };

        // Calculation Logic
        const s3Cost = storageGB * SERVICE_DATA.s3_per_gb;

        // Select best compute option logic
        // We try to find the best fit within the remaining budget, or default to the cheapest if budget is tight.
        const remainingAfterStorage = monthlyBudget - s3Cost;
        let suggestedCompute = SERVICE_DATA.compute.find(s => monthlyBudget >= s.minBudget && monthlyBudget <= s.maxBudget);

        // Fallback logic if no range matches perfectly, find the closest affordable one 
        if (!suggestedCompute) {
            // If budget is high, take the highest tier
            if (monthlyBudget > 500) suggestedCompute = SERVICE_DATA.compute[SERVICE_DATA.compute.length - 1];
            // If budget is low, take the lowest tier
            else suggestedCompute = SERVICE_DATA.compute[0];
        }

        let suggestedDB = SERVICE_DATA.database.find(s => monthlyBudget >= s.minBudget && monthlyBudget <= s.maxBudget);
        if (!suggestedDB) {
            if (monthlyBudget > 500) suggestedDB = SERVICE_DATA.database[SERVICE_DATA.database.length - 1];
            else suggestedDB = SERVICE_DATA.database[0];
        }

        const totalEst = s3Cost + suggestedCompute.price + suggestedDB.price;
        const utilization = monthlyBudget > 0 ? ((totalEst / monthlyBudget) * 100).toFixed(1) : 0;

        const recommendations = {
            compute: suggestedCompute,
            db: suggestedDB,
            storageCost: s3Cost.toFixed(3),
            totalEst: totalEst.toFixed(2),
            utilization: utilization
        };

        res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error('Budget calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate budget recommendations',
            error: error.message
        });
    }
};
