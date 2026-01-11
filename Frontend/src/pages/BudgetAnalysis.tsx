import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Wallet, HardDrive, CheckCircle2, AlertCircle, Server, Database, Cloud, Zap } from 'lucide-react';

// Pricing data reference (approximate monthly costs for common configurations)
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

const BudgetAnalysis = () => {
  const [budget, setBudget] = useState<string>("100");
  const [storage, setStorage] = useState<string>("10");

  const recommendations = useMemo(() => {
    const monthlyBudget = parseFloat(budget) || 10;
    const storageGB = parseFloat(storage) || 1;
    
    // Suggest Storage (S3 is always a base suggestion)
    const s3Cost = storageGB * SERVICE_DATA.s3_per_gb;
    
    // Pick first compute service that fits budget range
    const suggestedCompute = SERVICE_DATA.compute.find(s => monthlyBudget >= s.minBudget && monthlyBudget <= s.maxBudget) 
                             || SERVICE_DATA.compute[0];

    // Pick database service that fits
    const suggestedDB = SERVICE_DATA.database.find(s => monthlyBudget >= s.minBudget && monthlyBudget <= s.maxBudget)
                         || SERVICE_DATA.database[0];

    const totalEst = s3Cost + suggestedCompute.price + suggestedDB.price;

    return {
      compute: suggestedCompute,
      db: suggestedDB,
      storageCost: s3Cost.toFixed(3),
      totalEst: totalEst.toFixed(2),
      utilization: ((totalEst / monthlyBudget) * 100).toFixed(1)
    };
  }, [budget, storage]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary" />
            Budget-Based <span className="gradient-text">Architect</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your constraints to receive an optimized AWS service stack suggestion.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <GlassCard className="p-6 h-fit space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Constraints
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget ($)</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="budget" 
                    type="number" 
                    className="pl-10" 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">Required Storage (GB)</Label>
                <div className="relative">
                  <HardDrive className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="storage" 
                    type="number" 
                    className="pl-10" 
                    value={storage} 
                    onChange={(e) => setStorage(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Est. Total Monthly</span>
                <span className="text-xl font-bold text-primary">${recommendations.totalEst}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500" 
                  style={{ width: `${Math.min(parseFloat(recommendations.utilization), 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center uppercase tracking-wider">
                {recommendations.utilization}% of your budget utilized
              </p>
            </div>
          </GlassCard>

          {/* Output Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Recommended Service Stack</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendationItem 
                icon={<Server className="w-5 h-5 text-blue-400" />}
                title="Compute Suggestion" 
                value={recommendations.compute.name} 
                desc={recommendations.compute.desc}
                price={recommendations.compute.price}
              />
              <RecommendationItem 
                icon={<Database className="w-5 h-5 text-orange-400" />}
                title="Database Suggestion" 
                value={recommendations.db.name} 
                desc={recommendations.db.desc}
                price={recommendations.db.price}
              />
              <RecommendationItem 
                icon={<Cloud className="w-5 h-5 text-cyan-400" />}
                title="Storage Suggestion" 
                value={`S3 Standard (${storage} GB)`} 
                desc={`Highly durable object storage. Costs approx. $${recommendations.storageCost}/mo.`}
                price={parseFloat(recommendations.storageCost)}
              />
              <RecommendationItem 
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
                title="AI Optimized Stack" 
                value="Standard Web Stack" 
                desc="This combination provides the best price-to-performance ratio for your constraints."
                price={0}
              />
            </div>

            <GlassCard className="p-6 border-dashed border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary">Architect's Guidance</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    With a <strong>${budget}</strong> budget, utilizing <strong>{recommendations.compute.name}</strong> and <strong>{recommendations.db.name}</strong> ensures you maintain performance while staying cost-effective. Consider using <strong>Reserved Instances</strong> if your workload is stable to save up to 40% on compute.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

const RecommendationItem = ({ icon, title, value, desc, price }: { icon: React.ReactNode, title: string, value: string, desc: string, price: number }) => (
  <GlassCard className="p-5 flex flex-col justify-between border-white/5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
      </div>
      <p className="text-lg font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
    {price > 0 && (
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Estimated Monthly</span>
        <span className="font-mono text-primary font-bold">${price.toFixed(2)}</span>
      </div>
    )}
  </GlassCard>
);

export default BudgetAnalysis;