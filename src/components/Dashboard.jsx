import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Clock,
  Filter,
  Download,
  Calendar,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  const stats = [
    { label: 'Total Corrections', value: '1,247', change: '+12%', icon: TrendingUp, color: 'cyan' },
    { label: 'AI Summaries', value: '89', change: '+24%', icon: PieChart, color: 'purple' },
    { label: 'Templates Used', value: '42', change: '+8%', icon: BarChart3, color: 'green' },
    { label: 'Active Users', value: '156', change: '+5%', icon: Users, color: 'orange' },
  ];

  const recentActivities = [
    { user: 'john@company.com', action: 'Applied Business Template', time: '2 min ago', type: 'template' },
    { user: 'sarah@company.com', action: 'Auto-corrected 15 errors', time: '15 min ago', type: 'correction' },
    { user: 'mike@company.com', action: 'Generated AI Summary', time: '1 hour ago', type: 'ai' },
    { user: 'lisa@company.com', action: 'Exported to PDF', time: '2 hours ago', type: 'export' },
  ];

  const topTemplates = [
    { name: 'Business Report', usage: 142, growth: 12 },
    { name: 'Meeting Minutes', usage: 89, growth: 8 },
    { name: 'Email Draft', usage: 67, growth: 15 },
    { name: 'Project Proposal', usage: 45, growth: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="text-purple-400" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-400">Track usage, templates, and AI performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
            <option value="year">Last year</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-800/50 rounded-lg flex items-center gap-2 hover:bg-gray-700/50">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br from-${stat.color}-900/20 to-${stat.color}-800/10 rounded-2xl p-6 border border-${stat.color}-500/30`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-500/20 rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color}-400`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h3>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <Eye className="w-4 h-4" />
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'template' ? 'bg-blue-500/20' :
                    activity.type === 'correction' ? 'bg-green-500/20' :
                    activity.type === 'ai' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                  }`}>
                    {activity.type === 'template' && <FileText className="w-5 h-5 text-blue-400" />}
                    {activity.type === 'correction' && <RefreshCw className="w-5 h-5 text-green-400" />}
                    {activity.type === 'ai' && <Brain className="w-5 h-5 text-purple-400" />}
                    {activity.type === 'export' && <Download className="w-5 h-5 text-orange-400" />}
                  </div>
                  
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Usage */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Template Usage
            </h3>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          
          <div className="space-y-4">
            {topTemplates.map((template, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{template.usage}</span>
                    <span className={`text-sm ${template.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {template.growth > 0 ? '+' : ''}{template.growth}%
                    </span>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${(template.usage / 150) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total template uses this month</span>
              <span className="font-bold text-xl">343</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-purple-900/30 rounded-xl">
            <div className="text-4xl font-bold text-purple-300 mb-2">94%</div>
            <div className="text-gray-300">Accuracy Rate</div>
            <div className="text-sm text-gray-400 mt-2">Correction accuracy</div>
          </div>
          
          <div className="text-center p-6 bg-pink-900/30 rounded-xl">
            <div className="text-4xl font-bold text-pink-300 mb-2">2.3s</div>
            <div className="text-gray-300">Avg. Response Time</div>
            <div className="text-sm text-gray-400 mt-2">AI processing speed</div>
          </div>
          
          <div className="text-center p-6 bg-indigo-900/30 rounded-xl">
            <div className="text-4xl font-bold text-indigo-300 mb-2">4.8/5</div>
            <div className="text-gray-300">User Satisfaction</div>
            <div className="text-sm text-gray-400 mt-2">Based on feedback</div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-center gap-2 bg-gray-800/50 rounded-xl p-2">
        {['Today', 'Week', 'Month', 'Quarter', 'Year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range.toLowerCase())}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === range.toLowerCase() 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                : 'hover:bg-gray-700/50'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;