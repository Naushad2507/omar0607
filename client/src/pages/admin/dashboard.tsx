import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { 
  Users, 
  Store, 
  Ticket, 
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Eye,
  DollarSign
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: pendingVendors } = useQuery({
    queryKey: ["/api/admin/vendors/pending"],
  });

  const { data: pendingDeals } = useQuery({
    queryKey: ["/api/admin/deals/pending"],
  });

  if (!user) return null;

  const analyticsData = analytics as any;
  const pendingVendorsData = pendingVendors as any;
  const pendingDealsData = pendingDeals as any;

  const stats = [
    {
      title: "Total Users",
      value: analyticsData?.totalUsers?.toLocaleString() || "0",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Vendors",
      value: analyticsData?.totalVendors?.toLocaleString() || "0",
      change: "+8%",
      changeType: "increase",
      icon: Store,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Deals",
      value: analyticsData?.totalDeals?.toLocaleString() || "0",
      change: "+15%",
      changeType: "increase",
      icon: Ticket,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Revenue",
      value: `₹${(analyticsData?.revenueEstimate || 0).toLocaleString('en-IN')}`,
      change: "+22%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-royal",
      bgColor: "bg-royal/10",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "deal_approved",
      title: "Deal approved",
      description: "Fashion Hub submitted new winter sale",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    {
      id: 2,
      type: "vendor_registered",
      title: "New vendor registered",
      description: "TechZone Electronics from Mumbai",
      time: "4 hours ago",
      icon: Store,
      iconColor: "text-primary",
    },
    {
      id: 3,
      type: "help_ticket",
      title: "Help ticket submitted",
      description: "User reported payment issue",
      time: "6 hours ago",
      icon: AlertCircle,
      iconColor: "text-warning",
    },
  ];

  // Chart data based on analytics
  const cityChartData = analyticsData?.cityStats?.map((city: any) => ({
    name: city.city,
    deals: city.dealCount,
    users: city.userCount,
  })) || [
    { name: 'Mumbai', deals: 120, users: 450 },
    { name: 'Delhi', deals: 95, users: 380 },
    { name: 'Bangalore', deals: 85, users: 320 },
    { name: 'Chennai', deals: 70, users: 280 },
    { name: 'Hyderabad', deals: 60, users: 240 },
    { name: 'Pune', deals: 55, users: 200 }
  ];

  const categoryChartData = analyticsData?.categoryStats?.map((category: any) => ({
    name: category.category,
    deals: category.dealCount,
    claims: category.claimCount,
  })) || [
    { name: 'Fashion', deals: 45, claims: 38 },
    { name: 'Electronics', deals: 32, claims: 28 },
    { name: 'Food', deals: 28, claims: 25 },
    { name: 'Beauty', deals: 22, claims: 18 },
    { name: 'Home', deals: 18, claims: 15 },
    { name: 'Health', deals: 15, claims: 12 }
  ];

  const monthlyTrendData = [
    { month: 'Jan', users: 1200, deals: 450, revenue: 25000 },
    { month: 'Feb', users: 1800, deals: 620, revenue: 35000 },
    { month: 'Mar', users: 2400, deals: 780, revenue: 48000 },
    { month: 'Apr', users: 3200, deals: 920, revenue: 62000 },
    { month: 'May', users: 4100, deals: 1150, revenue: 78000 },
    { month: 'Jun', users: 4800, deals: 1380, revenue: 92000 },
  ];

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--primary))",
    },
    deals: {
      label: "Deals",
      color: "hsl(var(--success))",
    },
    claims: {
      label: "Claims",
      color: "hsl(var(--warning))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--royal))",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor platform performance and manage operations
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-success mr-1" />
                        <span className="text-xs text-success">{stat.change} from last month</span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Monthly Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                  <Line type="monotone" dataKey="deals" stroke="var(--color-deals)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* City Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Cities Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <BarChart data={cityChartData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="deals" fill="var(--color-deals)" />
                  <Bar dataKey="users" fill="var(--color-users)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <AreaChart data={categoryChartData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" dataKey="deals" stackId="1" stroke="var(--color-deals)" fill="var(--color-deals)" />
                  <Area type="monotone" dataKey="claims" stackId="1" stroke="var(--color-claims)" fill="var(--color-claims)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor === 'text-success' ? 'bg-success/10' : activity.iconColor === 'text-primary' ? 'bg-primary/10' : 'bg-warning/10'}`}>
                        <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Pending Vendors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Vendor Approvals</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/vendors">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingVendorsData && pendingVendorsData.length > 0 ? (
                <div className="space-y-4">
                  {pendingVendorsData.slice(0, 3).map((vendor: any) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{vendor.businessName}</p>
                        <p className="text-sm text-gray-500">{vendor.city}, {vendor.state}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                  {pendingVendorsData.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{pendingVendorsData.length - 3} more pending approvals
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No pending vendor approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Deals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Deal Approvals</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/deals">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingDealsData && pendingDealsData.length > 0 ? (
                <div className="space-y-4">
                  {pendingDealsData.slice(0, 3).map((deal: any) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deal.title}</p>
                        <p className="text-sm text-gray-500">
                          By {deal.vendor?.businessName} - {deal.discountPercentage}% off
                        </p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                  {pendingDealsData.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{pendingDealsData.length - 3} more pending approvals
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No pending deal approvals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}