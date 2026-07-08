import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DashboardService {
  async getManagerDashboard() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const [reports, pendingReports, blockers, workloadByProject] = await Promise.all([
      prisma.weeklyReport.findMany({
        where: {
          submitted_at: {
            gte: weekStart,
            lte: now
          }
        },
        select: {
          id: true,
          status: true,
          submitted_at: true,
          hours_worked: true,
          project_id: true,
          user_id: true,
          blockers: true
        }
      }),
      prisma.weeklyReport.count({
        where: { status: 'draft' }
      }),
      prisma.weeklyReport.findMany({
        where: { blockers: { not: null } },
        select: { blockers: true }
      }),
      prisma.weeklyReport.groupBy({
        by: ['project_id'],
        _count: { id: true },
        _sum: { hours_worked: true }
      })
    ]);

    const submittedThisWeek = reports.filter((report) => report.status === 'submitted').length;
    const totalReports = reports.length;
    const complianceRate = totalReports ? Math.round((submittedThisWeek / totalReports) * 100) : 0;

    const employeeStatusChart = await prisma.user.findMany({
      select: {
        id: true,
        full_name: true
      }
    });

    const statusByEmployee = employeeStatusChart.map((employee) => {
      const employeeReports = reports.filter((report) => report.user_id === employee.id);
      return {
        employee: employee.full_name,
        submitted: employeeReports.filter((report) => report.status === 'submitted').length,
        draft: employeeReports.filter((report) => report.status === 'draft').length
      };
    });

    const projectWorkload = await prisma.project.findMany({
      select: {
        id: true,
        project_name: true
      }
    });

    const workloadDistribution = projectWorkload.map((project) => {
      const workloadEntry = workloadByProject.find((entry) => entry.project_id === project.id);
      return {
        project: project.project_name,
        reports: workloadEntry?._count.id || 0,
        hours: workloadEntry?._sum.hours_worked || 0
      };
    });

    const completionTrend = reports
      .map((report) => ({
        date: report.submitted_at?.toISOString().slice(0, 10) || 'unknown',
        count: 1
      }))
      .reduce((acc, item) => {
        const existing = acc.find((entry) => entry.date === item.date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

    return {
      metrics: {
        total_reports_submitted_this_week: submittedThisWeek,
        pending_reports: pendingReports,
        submission_compliance_rate: `${complianceRate}%`,
        open_blockers: blockers.filter((report) => report.blockers && report.blockers.trim().length > 0).length
      },
      charts: {
        task_completion_trend: completionTrend,
        submission_status_by_employee: statusByEmployee,
        workload_distribution_by_project: workloadDistribution
      }
    };
  }
}

export const dashboardService = new DashboardService();
