import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Navigation, 
  ExternalLink, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Info
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { getHospitalSearchUrl } from '../../utils/emergencyServices';
import './NearbyHospitalsCard.css';

export default function NearbyHospitalsCard() {
  const { nearbyHospitals, sosState, fetchCoordinates } = useEmergency();
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = useMemo(() => {
    return nearbyHospitals.filter((hosp) => {
      const matchCity = selectedCity === 'all' || hosp.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchQuery = !searchQuery.trim() || 
        hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCity && matchQuery;
    });
  }, [nearbyHospitals, selectedCity, searchQuery]);

  const mapsQueryUrl = getHospitalSearchUrl(
    selectedCity !== 'all' ? selectedCity : searchQuery, 
    sosState.coordinates
  );

  return (
    <div className="nearby-hospitals-card">
      {/* Header */}
      <div className="hospitals-card-header">
        <div className="hospitals-title-group">
          <Building2 size={20} className="card-icon" />
          <div>
            <h3 className="card-title">Nearby Maternity & Emergency Hospitals</h3>
            <span className="card-subtitle">
              Verified public & apex maternity referral centers with 24/7 obstetric casualty units
            </span>
          </div>
        </div>

        {/* 1-Click Google Maps Search Action */}
        <a
          href={mapsQueryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          title="Search nearby maternity emergency hospitals on Google Maps"
        >
          <ExternalLink size={14} />
          <span>Find On Google Maps</span>
        </a>
      </div>

      {/* Geolocation Detector & Search Bar */}
      <div className="hospitals-toolbar">
        <div className="search-box-wrap">
          <Search size={16} className="search-icon" />
          <input
            id="hospital-search-input"
            type="text"
            className="form-input search-input"
            placeholder="Search by hospital name, area, or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search hospitals by name, area, or facility"
          />
        </div>

        <div className="city-filter-wrap">
          <select 
            className="form-select city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            aria-label="Filter by Metropolitan City"
          >
            <option value="all">All Metros</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchCoordinates}
            disabled={sosState.locationLoading}
            title="Detect GPS coordinates to sort by proximity"
          >
            <Navigation size={13} />
            <span>{sosState.locationLoading ? 'Locating...' : 'Use My GPS'}</span>
          </button>
        </div>
      </div>

      {/* Hospital Directory Grid */}
      <div className="hospitals-grid">
        {filteredHospitals.map((hosp) => {
          const directMapUrl = hosp.coordinates
            ? `https://maps.google.com/?q=${hosp.coordinates.lat},${hosp.coordinates.lng}`
            : `https://maps.google.com/?q=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`;

          return (
            <div key={hosp.id} className="hospital-item-card">
              <div className="hospital-card-top">
                <div className="hospital-title-row">
                  <h4 className="hospital-name">{hosp.name}</h4>
                  <span className="badge badge-24x7">
                    <Clock size={11} /> 24/7 Emergency
                  </span>
                </div>
                <span className="hospital-type">{hosp.type}</span>
              </div>

              <div className="hospital-address-row">
                <MapPin size={14} className="addr-icon" />
                <span>{hosp.address}</span>
              </div>

              {/* Facility Tags */}
              <div className="hospital-facility-tags">
                {hosp.facilities.map((fac, idx) => (
                  <span key={idx} className="facility-tag">
                    <CheckCircle2 size={11} color="var(--accent-sage)" />
                    {fac}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="hospital-card-actions">
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="btn-hosp-call"
                  title={`Call 24/7 Emergency triage at ${hosp.name}`}
                  aria-label={`Call emergency line for ${hosp.name}`}
                >
                  <Phone size={14} />
                  <span>Call Emergency: {hosp.emergencyPhone}</span>
                </a>

                <a
                  href={directMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hosp-directions"
                  title={`Open directions to ${hosp.name}`}
                  aria-label={`Get directions to ${hosp.name}`}
                >
                  <Navigation size={14} />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="empty-hospitals-box">
            <Info size={24} color="var(--text-tertiary)" />
            <p>No verified hospitals matching "{searchQuery}". Tap "Find On Google Maps" for live nearby facilities.</p>
            <a href={mapsQueryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Open Google Maps Search
            </a>
          </div>
        )}
      </div>

      {/* Honest Directory Disclosure */}
      <div className="hospitals-disclosure-banner">
        <ShieldAlert size={15} className="disclosure-icon" />
        <div className="disclosure-text">
          <strong>Directory Listing Disclaimer:</strong> SheSync provides verified hospital triage telephone numbers and mapping coordinates for reference. SheSync does not reserve hospital beds, dispatch private ambulances, or guarantee triage availability. For critical emergencies, always dial <strong>112 / 108</strong> immediately.
        </div>
      </div>
    </div>
  );
}
