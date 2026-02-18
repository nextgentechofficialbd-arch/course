
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, BookOpen, DollarSign, TrendingUp, Download, Settings, MoreVertical } from 'lucide-react';

const data = [
  { name: 'Mon', students: 40, revenue: 2400 },
  { name: 'Tue', students: 30, revenue: 1398 },
  { name: 'Wed', students: 20, revenue: 9800 },
  { name: 'Thu', students: 27, revenue: 3908 },
  { name: 'Fri', students: 18, revenue: 4800 },
  { name: 'Sat', students: 23, revenue: 3800 },
  { name: 'Sun', students: 34, revenue: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening with your platform.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Settings className="w-4 h-4" />
            Platform Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '$124,592', change: '+14.5%', icon: <DollarSign />, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Active Students', value: '12,402', change: '+8.2%', icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'New Courses', value: '45', change: '+12%', icon: <BookOpen />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Completion Rate', value: '68%', change: '+5.4%', icon: <TrendingUp />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-6 h-6' })}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color} ${stat.bg}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl">Revenue Overview</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium py-1 px-3 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl">New Student Growth</h3>
            <button className="text-primary text-sm font-bold">View Detailed Analysis</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                />
                <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-xl">Recent Enrollments</h3>
          <button className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"><MoreVertical className="w-5 h-5" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Course</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Alex Johnson', email: 'alex@example.com', course: 'Mastering Web Dev', date: 'Oct 24, 2023', amount: '$49.99', status: 'Completed' },
                { name: 'Maria Garcia', email: 'maria@example.com', course: 'UI/UX Advanced', date: 'Oct 23, 2023', amount: '$59.99', status: 'Processing' },
                { name: 'David Lee', email: 'david@example.com', course: 'Digital Marketing', date: 'Oct 22, 2023', amount: '$29.99', status: 'Completed' },
                { name: 'Sarah Wilson', email: 'sarah@example.com', course: 'Mastering Web Dev', date: 'Oct 22, 2023', amount: '$49.99', status: 'Failed' },
                { name: 'James Brown', email: 'james@example.com', course: 'Digital Marketing', date: 'Oct 21, 2023', amount: '$29.99', status: 'Completed' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="font-bold text-sm">{row.name}</div>
                        <div className="text-xs text-slate-400">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{row.course}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">{row.date}</td>
                  <td className="px-8 py-5 text-sm font-bold">{row.amount}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      row.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      row.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
