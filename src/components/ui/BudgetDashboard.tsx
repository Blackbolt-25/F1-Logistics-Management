'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { useToast } from "@/components/ui/use-toast"

interface TeamBudget {
  team_id: string;
  budget: number;
  spending: number;
  budget_left: number;
}

interface RequestData {
  request_id: string;
  time_of_request: string;
  cost: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function BudgetDashboard() {
  const [currentTeamData, setCurrentTeamData] = useState<TeamBudget | null>(null);
  const [allTeamsData, setAllTeamsData] = useState<TeamBudget[]>([]);
  const [requestsData, setRequestsData] = useState<RequestData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBudgetData();
    fetchRequestsData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const currentTeamResponse = await fetch('/api/budget/current-team', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });

      const allTeamsResponse = await fetch('/api/budget/all-teams', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });

      if (currentTeamResponse.ok && allTeamsResponse.ok) {
        const currentTeamData = await currentTeamResponse.json();
        const allTeamsData = await allTeamsResponse.json();
        
        setCurrentTeamData(currentTeamData);
        setAllTeamsData(allTeamsData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch budget data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching budget data",
        variant: "destructive",
      });
    }
  };

  const fetchRequestsData = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const currentTeamResponse = await fetch('/api/user/technical-head-id', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      const data = await currentTeamResponse.json();
      const response = await fetch(`/api/requests/spending?technicalHeadId=${data.technicalHeadId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequestsData(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch requests data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching requests data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching requests data",
        variant: "destructive",
      });
    }
  };

  const currentTeamChartData = currentTeamData ? [
    { name: 'Total Budget', amount: currentTeamData.budget },
    { name: 'Current Spending', amount: currentTeamData.spending },
    { name: 'Budget Left', amount: currentTeamData.budget_left }
  ] : [];

  const pieChartData = currentTeamData ? [
    { name: 'Spent', value: currentTeamData.spending },
    { name: 'Remaining', value: currentTeamData.budget_left }
  ] : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Budget Overview</h2>
      
      <div className="grid grid-cols-4 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Team Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentTeamChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time_of_request" 
                    type="category"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value) => [`$${value}`, 'Cost']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-4 md:grid-cols-1 gap-6 mb-6">

        <Card>
          <CardHeader>
            <CardTitle>All Teams Budget Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allTeamsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8" name="Total Budget" />
                  <Bar dataKey="spending" fill="#82ca9d" name="Current Spending" />
                  <Bar dataKey="budget_left" fill="#ffc658" name="Budget Left" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
