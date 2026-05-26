import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ComplaintService
} from '../../../../core/services/complaint.service';

import {
  AuthService
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-metrics',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './admin-dashboard-metrics.component.html',

  styleUrls: [
    './admin-dashboard-metrics.component.css'
  ]
})

export class AdminDashboardMetricsComponent
implements OnInit {

  
  // INJECT SERVICES
  

  private complaintService =
    inject(ComplaintService);

  authService =
    inject(AuthService);

  
  // COMPLAINT LIST
  

  complaintsList: any[] = [];

  
  // SVG ICONS
  

  public icons = {

    groupIcon: `
      <svg width="1em" height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">

        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.80443 5.60156C7.59109 5.60156 6.60749 6.58517 6.60749 7.79851C6.60749 9.01185 7.59109 9.99545 8.80443 9.99545C10.0178 9.99545 11.0014 9.01185 11.0014 7.79851C11.0014 6.58517 10.0178 5.60156 8.80443 5.60156Z"
          fill="currentColor">
        </path>

      </svg>
    `,

    arrowUpIcon: `
      <svg class="fill-current"
        width="1em"
        height="1em"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">

        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.06462 1.62393C6.20193 1.47072 6.40135 1.37432 6.62329 1.37432Z"
          fill="currentColor">
        </path>

      </svg>
    `,

    boxIconLine: `
      <svg width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">

        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.665 3.75621C11.8762 3.65064 12.1247 3.65064 12.3358 3.75621Z"
          fill="currentColor">
        </path>

      </svg>
    `,

    arrowDownIcon: `
      <svg class="fill-current"
        width="1em"
        height="1em"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">

        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257Z"
          fill="currentColor">
        </path>

      </svg>
    `
  };

  
  // TABLE HEADERS
  

  tableHeaders = [

    {
      label: 'Sr No',
      key: 'srNo'
    },

    {
      label: 'Citizen',
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

  
  // ON INIT
  

  ngOnInit(): void {
this.loadDummyComplaints()
    // this.getComplaints();
  }

  loadDummyComplaints(): void {

  this.complaintsList = [

    {
      srNo: 1,
      fullName: 'Rahul Sharma',
      complaintSubject: 'Road Damage',
      department: 'PWD',
      severityScore: 8,
      priority: 'High',
      status: 'Pending',
      createdDate: '24 May 2026'
    },

    {
      srNo: 2,
      fullName: 'Aman Verma',
      complaintSubject: 'Water Leakage',
      department: 'Water Department',
      severityScore: 5,
      priority: 'Medium',
      status: 'In Progress',
      createdDate: '23 May 2026'
    },

    {
      srNo: 3,
      fullName: 'Nazim Khan',
      complaintSubject: 'Electricity Issue',
      department: 'Electricity',
      severityScore: 3,
      priority: 'Low',
      status: 'Resolved',
      createdDate: '22 May 2026'
    }
  ];
}
  // GET ALL COMPLAINTS
  

  // getComplaints(): void {

  //   console.log(
  //     'Fetching Complaint Data...'
  //   );

  //   this.complaintService
  //     .getAllComplaints()

  //     .subscribe({

  //       // SUCCESS

  //       next: (response: any) => {

  //         console.log(
  //           'Complaint API Response:',
  //           response
  //         );

  //         // API DATA

  //         const complaints =
  //           response?.msg || [];

  //         // EMPTY CHECK

  //         if (!complaints.length) {

  //           console.log(
  //             'No Complaint Found'
  //           );

  //           this.complaintsList = [];

  //           return;
  //         }

  //         // SORT BY SEVERITY

  //         this.complaintsList =
  //           complaints.sort(

  //             (a: any, b: any) =>

  //               (b?.severityScore || 0) -
  //               (a?.severityScore || 0)
  //           );

  //         console.log(
  //           'Sorted Complaints:',
  //           this.complaintsList
  //         );
  //       },

  //       // ERROR

  //       error: (error: any) => {

  //         console.log(
  //           'Complaint Fetch Error:',
  //           error
  //         );

  //         this.complaintsList = [];
  //       },

  //       // COMPLETE

  //       complete: () => {

  //         console.log(
  //           'Complaint Fetch Completed'
  //         );
  //       }
  //     });
  // }

  
  // PRIORITY CLASS
  

  // getPriorityClass(
  //   priority: string
  // ): string {

  //   switch (priority) {

  //     case 'High':

  //       return `
  //         bg-red-100
  //         text-red-700
  //       `;

  //     case 'Medium':

  //       return `
  //         bg-yellow-100
  //         text-yellow-700
  //       `;

  //     case 'Low':

  //       return `
  //         bg-green-100
  //         text-green-700
  //       `;

  //     default:

  //       return `
  //         bg-gray-100
  //         text-gray-700
  //       `;
  //   }
  // }

  
  // SEVERITY LABEL
  

  // getSeverityLabel(
  //   score: number
  // ): string {

  //   if (score >= 8) {

  //     return 'Critical';
  //   }

  //   if (score >= 5) {

  //     return 'Moderate';
  //   }

  //   return 'Low Risk';
  // }
  // // SEVERITY CLASS
  
  // getSeverityClass(
  //   score: number
  // ): string {

  //   if (score >= 8) {

  //     return `
  //       bg-red-100
  //       text-red-700
  //     `;
  //   }

  //   if (score >= 5) {

  //     return `
  //       bg-yellow-100
  //       text-yellow-700
  //     `;
  //   }

  //   return `
  //     bg-green-100
  //     text-green-700
  //   `;
  // }
}