import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  ComplaintService
} from '../../../core/services/complaint.service';

import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-user-complaints',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule
  ],

  templateUrl:
    './user-complaints.component.html',

  styleUrl:
    './user-complaints.component.css',
})

export class UserComplaintsComponent
implements OnInit {

  
  // INJECT
  

  private complaintService =
    inject(ComplaintService);

  private router =
    inject(Router);

  private fb =
    inject(FormBuilder);

  private toastr =
    inject(ToastrService);

  
  // UI
  

  darkMode = false;

  currentStep = 0;

  isAiProcessing = false;

  aiProcessed = false;

  
  // IMAGE PREVIEW
  

  imagePreview:
    string | ArrayBuffer | null = null;

  
  // STEPPER
  

  steps = [

    {
      label:
        'Complaint Registration',

      status:
        'active'
    },

    {
      label:
        'AI Processing',

      status:
        'pending'
    },

    {
      label:
        'Documents Upload',

      status:
        'pending'
    },

    {
      label:
        'Submit',

      status:
        'pending'
    }
  ];

  
  // FORM
  

  complaintForm!: FormGroup;

  
  // AI DATA
  

  severityScore = 0;

  priority = '';

  aiDepartment = '';

  confidenceScore = 0;

  complaintTone = '';

  reason = '';

  administrativeSummary = '';

  requiresManualVerification = false;

  isContradictory = false;

  
  // INIT
  

  ngOnInit(): void {

    this.initializeForm();

    // TEST TOAST
    // this.toastr.success(
    //   'Toastr Working Successfully',
    //   'Success'
    // );
  }

  
  // FORM INIT
  

  initializeForm(): void {

    this.complaintForm =
      this.fb.group({

        fullName: [
          '',
          Validators.required
        ],

        mobileNumber: [
          '',
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        department: [
          '',
          Validators.required
        ],

        address: [
          '',
          Validators.required
        ],

        complaintSubject: [
          '',
          Validators.required
        ],

        complaintDetails: [
          '',
          Validators.required
        ],

        file: [null]
      });
  }

  
  // STEP CHANGE
  

  setStep(index: number): void {

    this.currentStep = index;

    this.steps.forEach(

      (step, i) => {

        if (i < index) {

          step.status =
            'completed';

        } else if (
          i === index
        ) {

          step.status =
            'active';

        } else {

          step.status =
            'pending';
        }
      }
    );
  }

  
  // AI PROCESS
  

// 
// AI PROCESS
// 


processAI(): void {

 
  // GET FORM VALUES
 

  const complaintSubject =

    this.complaintForm
      .get('complaintSubject')
      ?.value;

  const complaintDetails =

    this.complaintForm
      .get('complaintDetails')
      ?.value;

 
  // VALIDATION
 

  if (
    !complaintSubject ||
    complaintSubject.trim() === ''
  ) {

    this.toastr.error(
      'Please Enter Complaint Subject',
      'Validation Error'
    );

    return;
  }

  if (
    !complaintDetails ||
    complaintDetails.trim() === ''
  ) {

    this.toastr.error(
      'Please Enter Complaint Details',
      'Validation Error'
    );

    return;
  }

 
  // FINAL PAYLOAD
 

  const payload = {

    complaintSubject:
      complaintSubject,

    complaintDetails:
      complaintDetails
  };

 
  // CONSOLE
 

  console.log(
    'AI REQUEST PAYLOAD:',
    payload
  );

 
  // START LOADER
 

  this.isAiProcessing = true;

  this.aiProcessed = false;

 
  // API CALL
 

  this.complaintService
    .analyzeComplaint(payload)

    .subscribe({

     
      // SUCCESS
     

      next: (
        response: any
      ) => {

        console.log(
          'AI RESPONSE:',
          response
        );

        this.isAiProcessing =
          false;

        // BACKEND CHECK

        if (
          !response ||
          response.success === false
        ) {

          this.toastr.error(

            response?.msg ||

            'AI Processing Failed',

            'AI Error'
          );

          return;
        }

        // ANALYSIS OBJECT

        const analysis =

          response?.msg?.analysis;

        if (!analysis) {

          this.toastr.error(

            'Analysis Data Not Found',

            'AI Error'
          );

          return;
        }

        // SUCCESS FLAG

        this.aiProcessed = true;

       
        // AI DATA
       

        this.severityScore =

          analysis?.severityScore || 0;

        this.priority =

          analysis?.urgencyLevel || '';

        this.aiDepartment =

          analysis?.department?.departmentName || '';

        this.confidenceScore =

          analysis?.confidenceScore || 0;

        this.complaintTone =

          analysis?.complaintTone || '';

        this.reason =

          analysis?.reason || '';

        this.administrativeSummary =

          analysis?.administrativeSummary || '';

        this.requiresManualVerification =

          analysis?.requiresManualVerification || false;

        this.isContradictory =

          analysis?.isContradictory || false;

       
        // AUTO SELECT DEPARTMENT
       

        this.complaintForm.patchValue({

          department:
            this.aiDepartment
        });

       
        // SUCCESS TOAST
       

        this.toastr.success(

          'AI Analysis Completed Successfully',

          'Success'
        );

        console.log(
          'AI PROCESS SUCCESS'
        );
      },

     
      // ERROR
     

      error: (
        error: any
      ) => {

        console.log(
          'AI ERROR:',
          error
        );

        this.isAiProcessing =
          false;

        this.aiProcessed =
          false;

        const backendMessage =

          error?.error?.errors?.[0] ||

          error?.error?.msg ||

          'AI Processing Failed';

        this.toastr.error(

          backendMessage,

          'AI Error'
        );
      }
    });
}
  // FILE CHANGE
  

  onFileChange(
    event: any
  ): void {

    const file =
      event.target.files[0];

    if (!file) {

      return;
    }

    // PATCH FORM

    this.complaintForm.patchValue({

      file: file
    });

    // IMAGE PREVIEW

    if (

      file.type === 'image/png' ||

      file.type === 'image/jpeg' ||

      file.type === 'image/jpg'

    ) {

      const reader =
        new FileReader();

      reader.onload = () => {

        this.imagePreview =
          reader.result;
      };

      reader.readAsDataURL(
        file
      );

    } else {

      this.imagePreview =
        null;
    }

    console.log(
      'FILE:',
      file
    );
  }

  
  // SUBMIT COMPLAINT
  

  submit(): void {

    // FORM VALIDATION

    if (
      this.complaintForm.invalid
    ) {

      this.complaintForm
        .markAllAsTouched();

      this.toastr.warning(
        'Please Fill All Required Fields',
        'Validation Error'
      );

      return;
    }

    // AI VALIDATION

    if (
      !this.aiProcessed
    ) {

      this.toastr.warning(
        'Please Process AI First',
        'AI Required'
      );

      return;
    }

    // FINAL PAYLOAD

    const payload = {

      complaintId: 0,

      fullName:
        this.complaintForm.value.fullName,

      mobileNumber:
        this.complaintForm.value.mobileNumber,

      email:
        this.complaintForm.value.email,

      department:
        this.complaintForm.value.department,

      address:
        this.complaintForm.value.address,

      complaintSubject:
        this.complaintForm.value.complaintSubject,

      complaintDetails:
        this.complaintForm.value.complaintDetails,

      severityScore:
        this.severityScore,

      priority:
        this.priority,

      complaintTone:
        this.complaintTone,

      confidenceScore:
        this.confidenceScore,

      reason:
        this.reason,

      administrativeSummary:
        this.administrativeSummary,

      requiresManualVerification:
        this.requiresManualVerification,

      isContradictory:
        this.isContradictory,

      attachment:
        this.complaintForm.value.file?.name || ''
    };

    console.log(
      'FINAL PAYLOAD:',
      payload
    );

    // API CALL

    this.complaintService
      .saveComplaint(
        payload
      )

      .subscribe({

        // SUCCESS

        next: (
          response: any
        ) => {

          console.log(
            'SAVE RESPONSE:',
            response
          );

          // BACKEND SUCCESS CHECK

          if (
            response?.success === false
          ) {

            this.toastr.error(
              response?.msg ||
              'Complaint Submission Failed',
              'Submission Error'
            );

            return;
          }

          // SUCCESS TOAST

          this.toastr.success(
            'Complaint Submitted Successfully',
            'Success'
          );

          // REDIRECT

          setTimeout(() => {

            this.router.navigate([
              '/admin'
            ]);

          }, 1500);
        },

        // ERROR

        error: (
          error: any
        ) => {

          console.log(
            'SAVE ERROR:',
            error
          );

          const backendMessage =

            error?.error?.errors?.[0] ||

            error?.error?.msg ||

            'Complaint Submission Failed';

          this.toastr.error(
            backendMessage,
            'Submission Failed'
          );
        }
      });
  }
}