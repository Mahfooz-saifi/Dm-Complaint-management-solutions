import {
  HttpClient
} from '@angular/common/http';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ComplaintService {

  private http =
    inject(HttpClient);

 
  // BASE URL
 

  private apiUrl =
    environment.apiUrl;

 
  // ENDPOINTS
 

  private complaintFormEndpoint =
    `${this.apiUrl}/Admin/ComplaintForm`;

  private analyzeComplaintEndpoint =
    `${this.apiUrl}/apiCommon/analyzeComplaint`;

 
  // SAVE COMPLAINT
 

  saveComplaint(
    payload: any
  ): Observable<any> {

    console.log(
      'SAVE COMPLAINT PAYLOAD:',
      payload
    );

    return this.http.post(

      this.complaintFormEndpoint,

      payload
    );
  }

 
  // AI ANALYZE API
 

  analyzeComplaint(
    payload: {

      complaintSubject: string;

      complaintDetails: string;
    }

  ): Observable<any> {

    console.log(
      'AI API PAYLOAD:',
      payload
    );

    return this.http.post(

      this.analyzeComplaintEndpoint,

      payload
    );
  }
}