import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapServiceService } from '../map-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map: any; // You can replace 'any' with a more specific type if available
  ipAddress = '192.212.174.101';
  location!: any;
  userIpAddress = '';
  userLocation!: any;

  constructor(private mapService: MapServiceService) {}

  ngOnInit(): void {
    // Initialize the map
    this.initializeMap();
    this.mapService.ipAddressSbuject.subscribe((ip) => {
      this.ipAddress = ip;
      this.loadLocation();
    });
    this.getPublicIpAddress();
  }

  getPublicIpAddress = () => {
    try {
      fetch('https://api.ipify.org?format=json').then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        this.ipAddress = data.ip;
        console.log('this.ipAddress : ', this.ipAddress);
        console.log(this.ipAddress);
        this.mapService.getLocationByIp(this.ipAddress).subscribe((data) => {
          this.location = data;
          console.log('data : ', data);
          this.updateMap();
        });
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  loadLocation(): void {
    if (this.ipAddress) {
      this.mapService
        .getLocationByIp(this.ipAddress)
        .subscribe((locationData) => {
          console.log('this.ipAddress : ', this.ipAddress);
          console.log('locationData : ', locationData);
          this.location = locationData;
          this.updateMap();
        });
    }
  }

  initializeMap = () => {
    this.map = L.map('map').setView([51.505, -0.09], 10);

    // Add a tile layer (OpenStreetMap in this example)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    console.log(this.map);
  };
  findLocation(): void {
    if (this.ipAddress) {
      this.mapService.getLocationByIp(this.ipAddress).subscribe((data) => {
        this.location = data;
        this.updateMap();
      });
    }
  }

  updateMap(): void {
    console.log(this.location);
    if (this.location && this.location.location) {
      // const [lat, lon] = this.location
      //   .split(',')
      //   .map((coord: string) => parseFloat(coord));
      const lat = this.location.location.lat;
      const lon = this.location.location.lng;
      console.log('lat : ', lat);
      console.log('lon : ', lon);
      this.map.setView([lat, lon], 13);
      // Create a custom icon
      const customIcon = L.icon({
        iconUrl: '../assets/icon-location.svg',
        iconSize: [25, 32], // Set the size of your custom icon
        iconAnchor: [16, 32], // Set the anchor point relative to the icon's size
        popupAnchor: [0, -32], // Set the popup anchor point relative to the icon's size
      });
      const ipAddress = this.location.ip ? this.location.ip : '';
      const location =
        (this.location.location.city && this.location.location.city.length > 0
          ? this.location.location.city
          : '') +
        ' ' +
        (this.location.location.region &&
        this.location.location.region.length > 0
          ? this.location.location.region
          : '') +
        (this.location.location.postalCode &&
        this.location.location.postalCode.length > 0
          ? ' ' + this.location.location.postal
          : '');
      const timezone = this.location.location.timezone
        ? 'UTC ' + this.location.location.timezone
        : '';
      const isp = this.location.isp;
      this.mapService.setAddress(ipAddress, location, timezone, isp);
      // Add a marker with the custom icon
      L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
    }
  }
}
