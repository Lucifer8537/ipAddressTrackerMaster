import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface addressObject {
  ipAddress: string;
  location: string;
  timezone: string;
  isp: string;
}

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  private apiKey = 'at_Kemk0NpC4ZwBtR3KsooxZHtX3mpCH'; // Replace with your actual API key
  private ipifyApiUrl = 'https://geo.ipify.org/api/v2/country,city';
  ipAddress = '';
  location = '';
  timezone = '';
  isp = '';
  addressSubject = new Subject<addressObject>();
  ipAddressSbuject = new Subject<string>();
  addressData!: addressObject;
  constructor(private http: HttpClient) {}

  setAddress = (
    ipAddress: string,
    location: string,
    timezone: string,
    isp: string
  ) => {
    this.addressData = {
      ipAddress,
      location,
      timezone,
      isp,
    };
    this.addressSubject.next(this.addressData);
  };

  getLocationByIp(ipAddress: string): Observable<any> {
    this.ipAddress = ipAddress;
    const url = `${this.ipifyApiUrl}?apiKey=${this.apiKey}&ipAddress=${this.ipAddress}`;
    fetch(url).then((res) => {
      console.log('response : ', res);
      res.json().then((r) => console.log('r : ', r));
    });
    return this.http.get(url);
  }
  setIpAddressInput = (ip: string) => {
    this.ipAddressSbuject.next(ip);
  };
}
