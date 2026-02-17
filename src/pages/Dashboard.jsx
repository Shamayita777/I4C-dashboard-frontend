import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { analyticsAPI, reportsAPI } from '../services/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, reportsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        reportsAPI.getAll({ per_page: 5, page: 1 })
      ]);
      
      setAnalytics(analyticsRes.data);
      setRecentReports(reportsRes.data.reports);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Reports',
      value: analytics?.total_reports || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      change: '+12% from last month'
    },
    {
      name: 'New Cases',
      value: analytics?.status_breakdown?.find(s => s.status === 'NEW')?.count || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      change: 'Requires attention'
    },
    {
      name: 'In Progress',
      value: analytics?.status_breakdown?.find(s => s.status === 'IN_PROGRESS')?.count || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      change: 'Under investigation'
    },
    {
      name: 'Resolved',
      value: analytics?.status_breakdown?.find(s => s.status === 'RESOLVED')?.count || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: 'Successfully closed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to I4C Cyber Suspect Reporting System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="ml-2 flex items-baseline text-sm text-gray-600">
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Amount Involved Card */}
      <div className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 shadow-lg text-white">
        <div className="flex items-center">
          <CurrencyRupeeIcon className="h-12 w-12" />
          <div className="ml-4">
            <p className="text-sm font-medium opacity-90">Total Amount Involved</p>
            <p className="text-3xl font-bold">
              ₹{(analytics?.total_amount_involved || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm opacity-75 mt-1">Across all reported cases</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Fraud Mediums */}
        <div className="rounded-lg bg-white px-6 py-5 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Top Fraud Mediums
          </h3>
          <div className="space-y-3">
            {analytics?.fraud_medium_breakdown?.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.fraud_medium}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.total_reports) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top States */}
        <div className="rounded-lg bg-white px-6 py-5 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Reports by State (Top 5)
          </h3>
          <div className="space-y-3">
            {analytics?.state_breakdown?.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.location_state}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.total_reports) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="rounded-lg bg-white px-6 py-5 shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Reports
          </h3>
          <Link
            to="/reports"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fraud Medium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/reports/${report.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-900"
                    >
                      {report.reference_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.fraud_medium}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.location_city}, {report.location_state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${report.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
                      ${report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                      ${report.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.created_at), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
