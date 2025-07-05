"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Eye,
  Clock,
  MousePointer,
  Mail,
  ExternalLink,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react";

interface PageData {
  page: string;
  views: number;
  title: string;
}

interface DeviceTypes {
  mobile: number;
  desktop: number;
  tablet: number;
}

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  avgSessionTime: string;
  contactForms: number;
  projectViews: number;
  socialClicks: number;
  topPages: PageData[];
  deviceTypes: DeviceTypes;
}

// Simple analytics dashboard component
export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visitors: 0,
    pageViews: 0,
    avgSessionTime: "0m 0s",
    contactForms: 0,
    projectViews: 0,
    socialClicks: 0,
    topPages: [],
    deviceTypes: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    // In production, this would fetch from your analytics API
    const fetchAnalytics = () => {
      setTimeout(() => {
        setAnalytics({
          visitors: 1247,
          pageViews: 3891,
          avgSessionTime: "2m 34s",
          contactForms: 23,
          projectViews: 456,
          socialClicks: 89,
          topPages: [
            { page: "/", views: 1891, title: "Home" },
            { page: "/#projects", views: 1234, title: "Projects" },
            { page: "/#contact", views: 567, title: "Contact" },
            { page: "/#testimonials", views: 234, title: "Testimonials" },
          ],
          deviceTypes: {
            mobile: 62,
            desktop: 31,
            tablet: 7,
          },
        });
        setIsLoading(false);
      }, 1500);
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="bg-slate-900/50 border-slate-700/50 animate-pulse"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white font-playfair">
          Analytics Dashboard
        </h2>
        <Badge className="bg-green-600 text-white">Live Data</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Total Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analytics.visitors.toLocaleString()}
            </div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Page Views
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analytics.pageViews.toLocaleString()}
            </div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Avg. Session Time
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analytics.avgSessionTime}
            </div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Contact Forms
            </CardTitle>
            <Mail className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analytics.contactForms}
            </div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +25.0% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <MousePointer className="h-5 w-5 mr-2 text-purple-400" />
              User Interactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Project Views</span>
              <span className="text-white font-semibold">
                {analytics.projectViews}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Social Clicks</span>
              <span className="text-white font-semibold">
                {analytics.socialClicks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-200">External Links</span>
              <span className="text-white font-semibold">67</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-400" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-gray-200">Mobile</span>
              </div>
              <span className="text-white font-semibold">
                {analytics.deviceTypes.mobile}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-gray-200">Desktop</span>
              </div>
              <span className="text-white font-semibold">
                {analytics.deviceTypes.desktop}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-gray-200">Tablet</span>
              </div>
              <span className="text-white font-semibold">
                {analytics.deviceTypes.tablet}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-orange-400" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-200 truncate">{page.title}</span>
                <span className="text-white font-semibold text-sm">
                  {page.views}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Quick Analytics Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Google Analytics</div>
                <div className="text-gray-400 text-sm">Detailed reports</div>
              </div>
            </a>

            <a
              href="https://clarity.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Microsoft Clarity</div>
                <div className="text-gray-400 text-sm">User recordings</div>
              </div>
            </a>

            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded mr-3 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Search Console</div>
                <div className="text-gray-400 text-sm">SEO insights</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
