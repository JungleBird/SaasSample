import { useMemo } from "react";
import { employees } from "../../../data/people/employees";
import { entities } from "../../../data/people/entities";

export const usePeopleMetrics = () => {
  return useMemo(() => {
    // 1. Geographic Distribution (Heatmap data)
    const geographyStats = {
      firms: {},
      vendors: {},
      employees: {},
    };

    const parseLocation = (loc) => {
      if (!loc) return "Unknown";
      const parts = loc.split(" ");
      return parts.length >= 2 ? parts[parts.length - 2] : "Unknown";
    };

    entities.forEach((ent) => {
      const state = parseLocation(ent.location);
      const typeKey = ent.type === "Firm" ? "firms" : "vendors";
      geographyStats[typeKey][state] =
        (geographyStats[typeKey][state] || 0) + 1;
    });

    employees.forEach((emp) => {
      const state = parseLocation(emp.location);
      geographyStats.employees[state] =
        (geographyStats.employees[state] || 0) + 1;
    });

    // 2. Compliance Risk Profile
    const calculateComplianceScore = (obj) => {
      let score = 0;
      if (obj.email) score++;
      if (obj.check) score++;
      if (obj.thumb) score++;
      if (obj.doc) score++;
      return score;
    };

    const entityCompliance = {
      highRisk: [], // Score 0-1
      mediumRisk: [], // Score 2-3
      lowRisk: [], // Score 4
      avgScore: 0,
    };

    let totalEntityScore = 0;
    entities.forEach((ent) => {
      const score = calculateComplianceScore(ent);
      totalEntityScore += score;
      if (score <= 1) entityCompliance.highRisk.push(ent);
      else if (score <= 3) entityCompliance.mediumRisk.push(ent);
      else entityCompliance.lowRisk.push(ent);
    });
    entityCompliance.avgScore = (totalEntityScore / entities.length).toFixed(1);

    // 3. Employee Title Distribution
    const employeeTitles = employees.reduce((acc, emp) => {
      acc[emp.title] = (acc[emp.title] || 0) + 1;
      return acc;
    }, {});

    const sortedTitles = Object.entries(employeeTitles)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      geographyStats,
      entityCompliance,
      employeeTitles: sortedTitles,
      totalEntities: entities.length,
      totalEmployees: employees.length,
    };
  }, []);
};
