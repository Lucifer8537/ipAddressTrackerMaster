import { Component, OnInit } from '@angular/core';
import { MapServiceService } from '../map-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private mapService: MapServiceService) {}
  ipAddress = '';
  location = '';
  timezone = '';
  isp = '';
  ipAddressInput = '';
  ngOnInit(): void {
    this.mapService.addressSubject.subscribe((data) => {
      console.log('header component : ', data);
      this.ipAddress = data.ipAddress;
      this.location = data.location;
      this.timezone = data.timezone;
      this.isp = data.isp;
    });
  }
  onClick = () => {
    console.log('ipAddress : ', this.ipAddressInput);
    this.mapService.setIpAddressInput(this.ipAddressInput);
    this.ipAddressInput = '';
  };
}
