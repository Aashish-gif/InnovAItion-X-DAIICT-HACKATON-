import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { PieChart, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

const BudgetAnalysis = () => {
  // Mock data for display
  const stats = [
    { label: "Total Estimated Monthly Cost", value: "$142.50", icon: Wallet, color: "text-primary" },
    { label: "Projected Annual Savings", value: "$420.00", icon: TrendingUp, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary" />
            Budget <span className="gradient-text">Analysis</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time infrastructure cost estimation and optimization suggestions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-8 border-dashed border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Cost Optimization Tip</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your current architecture uses On-Demand instances. Switching to Reserved Instances for your 
                Database nodes could save you up to 30% monthly.
              </p>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default BudgetAnalysis;