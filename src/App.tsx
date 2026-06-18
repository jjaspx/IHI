/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Radar, 
  Search, 
  Settings, 
  Bell, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Package,
  ArrowRight,
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  Cell as RechartsCell
} from 'recharts';

// --- Types ---

interface KPIData {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'stable';
  footer?: string;
  borderColor: string;
}

interface AlertData {
  id: string;
  category: string;
  node: string;
  severity: 'high' | 'medium' | 'low';
  value: string;
  action: string;
  icon: React.ReactNode;
  iconColor: string;
}

interface RegionalData {
  name: string;
  actual: number;
  target: number;
  sku: string;
  color: string;
}

// --- Mock Data ---

const KPI_STATS: KPIData[] = [
  {
    label: '总 SKU 数',
    value: '142.8k',
    trend: '比去年增长 2.4%',
    trendType: 'up',
    borderColor: 'border-primary'
  },
  {
    label: '在库/无库存比例',
    value: '94:6',
    footer: '库存充足率 94%',
    borderColor: 'border-secondary'
  },
  {
    label: '总库存价值',
    value: '$12.4M',
    footer: '加权平均成本',
    borderColor: 'border-tertiary'
  },
  {
    label: '平均供应天数 (DOS)',
    value: '38.2',
    trend: '警告: 减少 4.1 天',
    trendType: 'down',
    borderColor: 'border-primary-dim'
  },
  {
    label: '90天预测覆盖率',
    value: '89%',
    trend: '稳定',
    trendType: 'stable',
    borderColor: 'border-on-primary-fixed-variant'
  }
];

const REGIONAL_DISTRIBUTION: RegionalData[] = [
  { name: '北美地区', actual: 88, target: 95, sku: '42.1k SKU', color: '#005bc4' },
  { name: '欧洲、中东和非洲中部', actual: 92, target: 90, sku: '38.4k SKU', color: '#005bc4' },
  { name: '亚太东部', actual: 78, target: 85, sku: '54.2k SKU', color: '#9f403d' },
  { name: '拉美南部', actual: 95, target: 92, sku: '12.1k SKU', color: '#005bc4' },
];

const ALERTS: AlertData[] = [
  {
    id: '1',
    category: '严重缺货',
    node: '上海配送中心 (SH-04)',
    severity: 'high',
    value: '每周 $1.2M',
    action: '重新路由供应',
    icon: <AlertCircle size={18} />,
    iconColor: 'text-error'
  },
  {
    id: '2',
    category: '预测偏差',
    node: '柏林物流枢纽 (BE-01)',
    severity: 'medium',
    value: '每月 $420k',
    action: '调整参数',
    icon: <Info size={18} />,
    iconColor: 'text-tertiary-fixed-dim'
  },
  {
    id: '3',
    category: '超量库存警告',
    node: '芝加哥区域仓库 (CH-09)',
    severity: 'low',
    value: '$180k 积压',
    action: '制定清理计划',
    icon: <Package size={18} />,
    iconColor: 'text-primary'
  }
];

const HEALTH_DATA = [
  { name: 'Score', value: 85 },
  { name: 'Remaining', value: 15 },
];

const HEALTH_COLORS = ['#005bc4', '#f0f4f7'];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 group border-l-4 ${
      active 
        ? 'bg-surface-container-high text-primary font-medium border-primary' 
        : 'text-on-surface-variant hover:bg-surface-container-low border-transparent'
    }`}
  >
    <Icon size={18} className={active ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'} />
    <span className="text-sm tracking-tight">{label}</span>
  </a>
);

const KPICard = ({ data, index }: { data: KPIData, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="stat-card flex flex-col justify-between h-full"
  >
    <div>
      <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant mb-2 block">{data.label}</span>
      <div className="text-2xl font-bold text-on-surface">{data.value}</div>
    </div>
    <div className="mt-3">
      {data.trend && (
        <div className={`flex items-center gap-1 text-[11px] font-medium ${
          data.trendType === 'up' ? 'text-success' : 
          data.trendType === 'down' ? 'text-error' : 'text-on-surface-variant'
        }`}>
          {data.trendType === 'up' && <TrendingUp size={12} />}
          {data.trendType === 'down' && <AlertTriangle size={12} />}
          {data.trendType === 'stable' && <CheckCircle size={12} />}
          <span>{data.trend}</span>
        </div>
      )}
      {data.footer && !data.trend && (
        <p className="text-[11px] text-on-surface-variant">{data.footer}</p>
      )}
      {data.label === '在库/无库存比例' && (
        <div className="mt-2 w-full bg-border h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[94%]"></div>
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('区域');

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/10">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-sidebar-bg border-b border-border shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-on-surface tracking-tight">Inventory Intelligence</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center h-full">
            {['区域', '品类', '时间范围'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-colors h-16 border-b-2 flex items-center ${
                  activeTab === tab ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-on-surface p-2 transition-colors rounded-lg hover:bg-surface-container-low">
            <Bell size={18} />
          </button>
          <button className="text-on-surface-variant hover:text-on-surface p-2 transition-colors rounded-lg hover:bg-surface-container-low">
            <Settings size={18} />
          </button>
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-on-surface">Sarah Jenkins</p>
              <p className="text-[10px] text-on-surface-variant">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-surface-container-high border border-border overflow-hidden flex items-center justify-center text-primary">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col border-r border-border bg-sidebar-bg z-40 py-6">
        <nav className="space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active />
          <SidebarItem icon={AlertTriangle} label="Risk Distribution" />
          <SidebarItem icon={Radar} label="Forecast Radar" />
          <SidebarItem icon={Search} label="SKU Search" />
          <SidebarItem icon={Settings} label="System Settings" />
        </nav>
        
        <div className="mt-auto px-6">
          <div className="p-4 bg-surface-container-high rounded-xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Storage Status</p>
            <p className="text-xs text-on-surface-variant mb-3">82% of capacity used</p>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[82%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8 min-h-screen flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Executive Dashboard</h1>
            <p className="text-on-surface-variant text-sm">Welcome back. Here's what's happening today.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dim transition-colors shadow-sm flex items-center gap-2">
            <TrendingUp size={16} />
            Generate Report
          </button>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {KPI_STATS.map((stat, i) => (
            <div key={i} className="flex">
              <KPICard data={stat} index={i} />
            </div>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Inventory Health Index */}
          <div className="col-span-12 lg:col-span-5 content-card p-8 flex flex-col justify-between min-h-[420px]">
            <div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Inventory Health Index</h3>
              <p className="text-on-surface-variant text-sm mb-8">Composite score of quality, turnover, and accuracy.</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={HEALTH_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    startAngle={225}
                    endAngle={-45}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {HEALTH_DATA.map((entry, index) => (
                      <RechartsCell key={`cell-${index}`} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="text-5xl font-bold text-on-surface">85</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mt-1">Optimal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              {[
                { label: 'Turnover', value: '4.2x' },
                { label: 'Accuracy', value: '92%' },
                { label: 'Quality', value: '98%' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-base font-bold text-on-surface">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="col-span-12 lg:col-span-7 content-card p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">Regional Distribution</h3>
                <p className="text-on-surface-variant text-sm">Actual vs. Target SKU levels by territory.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-sm"></div>
                  <span className="text-[10px] font-medium text-on-surface-variant">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-container rounded-sm"></div>
                  <span className="text-[10px] font-medium text-on-surface-variant">Target</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {REGIONAL_DISTRIBUTION.map((region, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-on-surface">{region.name}</span>
                    <span className="text-[11px] font-medium text-on-surface-variant">{region.sku}</span>
                  </div>
                  <div className="relative h-3 w-full bg-surface-container-low rounded-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.actual}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute h-full rounded-full z-10"
                      style={{ backgroundColor: region.color === '#9f403d' ? '#ef4444' : '#2563eb' }}
                    />
                    <div 
                      className="absolute h-full bg-primary-container rounded-full"
                      style={{ width: `${region.target}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="content-card">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Critical Performance Alerts</h3>
              <p className="text-on-surface-variant text-sm">Anomaly detection from the last 24 hours.</p>
            </div>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All Tasks
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-8 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-border">Alert Category</th>
                  <th className="px-8 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-border">Affected Node</th>
                  <th className="px-8 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-border">Severity</th>
                  <th className="px-8 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-border">Impact Value</th>
                  <th className="px-8 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-border">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ALERTS.map((alert) => (
                  <tr key={alert.id} className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className={alert.iconColor === 'text-error' ? 'text-error' : alert.iconColor === 'text-tertiary-fixed-dim' ? 'text-primary' : 'text-on-surface-variant'}>
                          {alert.icon}
                        </span>
                        <span className="font-semibold text-sm text-on-surface">{alert.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{alert.node}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        alert.severity === 'high' ? 'bg-error-container text-on-error-container' :
                        alert.severity === 'medium' ? 'bg-secondary-container text-on-secondary-container' :
                        'bg-primary-container text-on-primary-container'
                      }`}>
                        {alert.severity === 'high' ? 'High Risk' : alert.severity === 'medium' ? 'Medium' : 'Low Impact'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-on-surface">{alert.value}</td>
                    <td className="px-8 py-5">
                      <button className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase cursor-pointer hover:underline">
                        {alert.action}
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
