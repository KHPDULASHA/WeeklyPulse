import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { useAuth } from '../context/AuthContext';
import { ChartCard } from '../components/ChartCard';
import { DashboardCard } from '../components/DashboardCard';
import { ReportTable } from '../components/ReportTable';
import { getManagerDashboard } from '../services/dashboardService';


const PIE_COLORS = ['#22d3ee', '#f59e0b'];


export function DashboardPage() {

  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);

        const data = await getManagerDashboard();

        setAnalytics(data);


      } catch (err) {

        setError(
          err.response?.data?.error ||
          'Unable to load dashboard'
        );

      } finally {

        setLoading(false);

      }

    }


    loadDashboard();

  }, []);



  const pieData = useMemo(() => {

    if (!analytics?.metrics) {
      return [];
    }


    const submitted = Number(
      analytics.metrics.total_reports_submitted_this_week || 0
    );


    const pending = Number(
      analytics.metrics.pending_reports || 0
    );


    return [
      {
        name: 'Submitted',
        value: submitted
      },
      {
        name: 'Pending',
        value: pending
      }
    ];

  }, [analytics]);



  const reportRows = useMemo(() => {

    const employeeRows =
      analytics?.charts?.submission_status_by_employee || [];


    return employeeRows.map((row) => ({

      employee: row.employee,

      status:
        `${row.submitted} submitted / ${row.draft} draft`,

      hours:
        row.submitted * 40,

      blockers:
        row.draft
          ? 'Follow-up needed'
          : 'All clear'

    }));

  }, [analytics]);



  return (

    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16 text-slate-100">


      {/* Header */}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl md:flex-row md:items-end md:justify-between">


        <div>

          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            Manager Dashboard
          </p>


          <h1 className="mt-2 text-3xl font-semibold">

            Welcome back, {user?.full_name || 'Manager'}

          </h1>


          <p className="mt-2 text-slate-400">

            Review weekly submissions, track blockers,
            and monitor team progress.

          </p>

        </div>



        <button

          onClick={logout}

          className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm hover:border-cyan-400"

        >

          Logout

        </button>


      </div>



      {error && (

        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-300">

          {error}

        </div>

      )}





      {loading ? (

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center">

          Loading dashboard analytics...

        </div>


      ) : (


        <>



          {/* Summary Cards */}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">


            <DashboardCard

              title="Reports Submitted"

              value={
                analytics?.metrics?.total_reports_submitted_this_week ?? 0
              }

              subtitle="This week"

              accent="cyan"

            />


            <DashboardCard

              title="Pending Reports"

              value={
                analytics?.metrics?.pending_reports ?? 0
              }

              subtitle="Awaiting review"

              accent="amber"

            />


            <DashboardCard

              title="Compliance Rate"

              value={
                analytics?.metrics?.submission_compliance_rate ?? '0%'
              }

              subtitle="Submission health"

              accent="emerald"

            />


            <DashboardCard

              title="Open Blockers"

              value={
                analytics?.metrics?.open_blockers ?? 0
              }

              subtitle="Needs follow-up"

              accent="rose"

            />


          </div>





          {/* Charts */}


          <div className="mt-8 grid gap-6 xl:grid-cols-2">


            <ChartCard

              title="Task Completion Trend"

              subtitle="Weekly submission activity"

            >

              <ResponsiveContainer width="100%" height="100%">

                <LineChart

                  data={
                    analytics?.charts?.task_completion_trend || []
                  }

                >

                  <CartesianGrid
                    stroke="#1f2937"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                  />

                  <YAxis
                    stroke="#94a3b8"
                  />

                  <Tooltip />


                  <Line

                    type="monotone"

                    dataKey="count"

                    stroke="#22d3ee"

                    strokeWidth={3}

                  />

                </LineChart>


              </ResponsiveContainer>


            </ChartCard>





            <ChartCard

              title="Workload By Project"

              subtitle="Reports and hours tracked"

            >

              <ResponsiveContainer width="100%" height="100%">

                <BarChart

                  data={
                    analytics?.charts?.workload_distribution_by_project || []
                  }

                >

                  <CartesianGrid
                    stroke="#1f2937"
                    strokeDasharray="3 3"
                  />


                  <XAxis
                    dataKey="project"
                    stroke="#94a3b8"
                  />


                  <YAxis
                    stroke="#94a3b8"
                  />


                  <Tooltip />


                  <Bar

                    dataKey="reports"

                    fill="#22d3ee"

                    radius={[6,6,0,0]}

                  />


                  <Bar

                    dataKey="hours"

                    fill="#38bdf8"

                    radius={[6,6,0,0]}

                  />


                </BarChart>


              </ResponsiveContainer>


            </ChartCard>





            <ChartCard

              title="Submission Status"

              subtitle="Submitted vs Pending"

            >

              <ResponsiveContainer width="100%" height="100%">


                <PieChart>


                  <Pie

                    data={pieData}

                    dataKey="value"

                    nameKey="name"

                    innerRadius={70}

                    outerRadius={100}

                  >


                    {pieData.map((entry,index)=>(

                      <Cell

                        key={entry.name}

                        fill={
                          PIE_COLORS[index % PIE_COLORS.length]
                        }

                      />

                    ))}


                  </Pie>


                  <Tooltip />


                </PieChart>


              </ResponsiveContainer>


            </ChartCard>





            <ChartCard

              title="Team Submission Snapshot"

              subtitle="Recent reporting activity"

            >

              <ReportTable rows={reportRows} />

            </ChartCard>



          </div>


        </>

      )}


    </main>

  );

}