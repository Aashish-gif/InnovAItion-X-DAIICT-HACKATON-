export const getServiceRecommendation = (req, res) => {
    try {
        const { workloadType, budget } = req.body;
        const numericBudget = parseFloat(budget) || 0;

        let recommendation = {
            service: "General EC2",
            reason: "Versatile compute for various workloads.",
            estimatedCost: `$${numericBudget}`,
            complexity: "Medium"
        };

        if (workloadType === 'Web Application') {
            if (numericBudget < 20) {
                recommendation = {
                    service: "Amazon Lightsail",
                    reason: "Perfect for simple web apps and blogs. Fixed monthly price, easy setup.",
                    estimatedCost: "$3.50 - $20 / month",
                    complexity: "Low"
                };
            } else if (numericBudget < 100) {
                recommendation = {
                    service: "AWS App Runner",
                    reason: "Fully managed service for containerized web apps. No infrastructure to manage.",
                    estimatedCost: "Pay per use (~$25+ / month)",
                    complexity: "Low"
                };
            } else {
                recommendation = {
                    service: "Amazon ECS (Fargate) + ALB",
                    reason: "Scalable, production-grade container orchestration. Good for high traffic.",
                    estimatedCost: "$100+ / month (depends on traffic)",
                    complexity: "Medium"
                };
            }
        } else if (workloadType === 'Mobile Backend') {
            if (numericBudget < 50) {
                recommendation = {
                    service: "AWS Amplify",
                    reason: "Full-stack platform for web and mobile apps. Generates backend resources automatically.",
                    estimatedCost: "Free tier available, pay as you go",
                    complexity: "Low"
                };
            } else {
                recommendation = {
                    service: "API Gateway + Lambda + DynamoDB",
                    reason: "Serverless architecture. Infinite scaling, pay only for requests.",
                    estimatedCost: "Pay per request",
                    complexity: "Medium"
                };
            }
        } else if (workloadType === 'Data Analytics') {
            if (numericBudget < 100) {
                recommendation = {
                    service: "Amazon Athena",
                    reason: "Serverless query service. Analyze data directly in S3 using SQL.",
                    estimatedCost: "$5 per TB scanned",
                    complexity: "Low"
                };
            } else {
                recommendation = {
                    service: "Amazon Redshift / EMR",
                    reason: "Enterprise-grade data warehousing (Redshift) or Big Data processing (EMR).",
                    estimatedCost: "$200+ / month",
                    complexity: "High"
                };
            }
        } else if (workloadType === 'File Storage') {
            recommendation = {
                service: "Amazon S3",
                reason: "Industry standard for object storage. 99.999999999% durability.",
                estimatedCost: "$0.023 per GB",
                complexity: "Low"
            };
        } else if (workloadType === 'Machine Learning') {
            if (numericBudget < 50) {
                recommendation = {
                    service: "SageMaker Canvas / Studio Lab",
                    reason: "Visual interface or free notebook environment for learning.",
                    estimatedCost: "Free tier / Usage based",
                    complexity: "Low"
                };
            } else {
                recommendation = {
                    service: "Amazon SageMaker",
                    reason: "Build, train, and deploy ML models at scale.",
                    estimatedCost: "$50+ / month (instance based)",
                    complexity: "High"
                };
            }
        }

        res.status(200).json({
            success: true,
            data: recommendation
        });

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendation',
            error: error.message
        });
    }
};
