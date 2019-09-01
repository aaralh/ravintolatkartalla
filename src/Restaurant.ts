interface Location {
    lat: string,
    lng: string,
}

declare const L: any;

export class Restaurant {

    private _marker: any;
    private _map: any;
    constructor(
        private _title: string,
        private _address: string,
        private _location: Location,
        private _website: string,
        private _type: string,
        private _lunchUrl?: string
    ) {
        if(!this.location) {
            return;
        }
        this._marker = L.marker([+this.location.lat, +this.location.lng]);
        let content = this.website ? '<p>' + this.title + '</p><br><a href="' + this.website + '">Ruokalista</a>' : '<p>' + this.title + '</p>';
        this._marker.bindPopup(content);
    }

    public get title(): string {
        return this._title;
    }

    public get type(): string {
        return this._type;
    }

    public get address(): string {
        return this._address;
    }

    public get location(): Location {
        return this._location;
    }
    
    public get website(): string {
        return this._website;
    }

    public get lunchUrl(): string | undefined{
        return this._lunchUrl;
    }

    public addMarkerToMap(map: any) {
        if (!this._marker) {
            return;
        }
        this._map = map;
        this._marker.addTo(map);
      
    }

    public hideMarker(): void {
        if (!this._marker) {
            return;
        }
        this._marker.remove();

    }

    public showMarker(): void {
        if (!this._map && !this._marker) {
            return;
        }
        this._marker.addTo(this._map);
    }
}