// admin-dashboard.component.ts

import {
  Component
} from '@angular/core';

import {
  AdminDashboardMetricsComponent
} from '../../../shared/components/admin-dashboard/admin-dashboard-metrics/admin-dashboard-metrics.component';

import {
  CommonReusableTableComponent
} from '../../../shared/components/common/common-reusable-table/common-reusable-table.component';

@Component({
  standalone: true,

  selector: 'app-admin-dashboard',

  imports: [

    AdminDashboardMetricsComponent,

    CommonReusableTableComponent
  ],

  templateUrl:
    './admin-dashboard.component.html',
})

export class AdminDashboardComponent {

  complaintsList: any[] = [];

 
  // TABLE HEADERS
 

  tableColumns = [

    {
      label: 'Sr No',
      key: 'srNo'
    },

    {
      label: 'Full Name',
      key: 'fullName'
    },

    {
      label: 'Subject',
      key: 'complaintSubject'
    },

    {
      label: 'Department',
      key: 'department'
    },

    {
      label: 'AI Severity',
      key: 'severityScore'
    },

    {
      label: 'Priority',
      key: 'priority'
    },

    {
      label: 'Status',
      key: 'status'
    },

    {
      label: 'Date',
      key: 'createdDate'
    },

    {
      label: 'Action',
      key: 'action'
    }
  ];

 
  // INIT
 

  ngOnInit(): void {

    this.getComplaints();
  }

 
  // GET COMPLAINTS
 

  getComplaints(): void {

    // TEMP STATIC DATA

    this.complaintsList = [

      {
        srNo: 1,
        fullName: 'Rahul Sharma',
        complaintSubject: 'Road Damage',
        department: 'PWD',
        severityScore: 9,
        priority: 'High',
        status: 'Pending',
        createdDate: '24 May 2026'
      },

      {
        srNo: 2,
        fullName: 'Aman Verma',
        complaintSubject: 'Water Leakage',
        department: 'JAL NIGAM',
        severityScore: 6,
        priority: 'Medium',
        status: 'In Progress',
        createdDate: '23 May 2026'
      },

      {
        srNo: 3,
        fullName: 'Nazim Khan',
        complaintSubject: 'Street Light Issue',
        department: 'ELECTRICITY',
        severityScore: 3,
        priority: 'Low',
        status: 'Resolved',
        createdDate: '22 May 2026'
      }
    ];

    // SORT BY SEVERITY

    this.complaintsList =

      this.complaintsList.sort(

        (a: any, b: any) =>

          b.severityScore -
          a.severityScore
      );

    console.log(
      'Complaint Data:',
      this.complaintsList
    );
  }

 
  // PRIORITY COLOR
 

  getPriorityClass(
    priority: string
  ): string {

    switch (priority) {

      case 'High':

        return `
          bg-red-100
          text-red-700
        `;

      case 'Medium':

        return `
          bg-yellow-100
          text-yellow-700
        `;

      case 'Low':

        return `
          bg-green-100
          text-green-700
        `;

      default:

        return `
          bg-gray-100
          text-gray-700
        `;
    }
  }

 
  // SEVERITY LABEL
 

  getSeverityLabel(
    score: number
  ): string {

    if (score >= 8) {

      return 'Critical';
    }

    if (score >= 5) {

      return 'Moderate';
    }

    return 'Low Risk';
  }

 
  // SEVERITY COLOR
 

  getSeverityClass(
    score: number
  ): string {

    if (score >= 8) {

      return `
        bg-red-100
        text-red-700
      `;
    }

    if (score >= 5) {

      return `
        bg-yellow-100
        text-yellow-700
      `;
    }

    return `
      bg-green-100
      text-green-700
    `;
  }
}