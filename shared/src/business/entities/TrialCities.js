const COMMON = [
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Mobile', state: 'Alabama' },
  { city: 'Anchorage', state: 'Alaska' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Little Rock', state: 'Arkansas' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'San Diego', state: 'California' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Hartford', state: 'Connecticut' },
  { city: 'Washington', state: 'District of Columbia' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Honolulu', state: 'Hawaii' },
  { city: 'Boise', state: 'Idaho' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Indianapolis', state: 'Indiana' },
  { city: 'Des Moines', state: 'Iowa' },
  { city: 'Louisville', state: 'Kentucky' },
  { city: 'New Orleans', state: 'Louisiana' },
  { city: 'Baltimore', state: 'Maryland' },
  { city: 'Boston', state: 'Massachusetts' },
  { city: 'Detroit', state: 'Michigan' },
  { city: 'St. Paul', state: 'Minnesota' },
  { city: 'Jackson', state: 'Mississippi' },
  { city: 'Kansas City', state: 'Missouri' },
  { city: 'St. Louis', state: 'Missouri' },
  { city: 'Helena', state: 'Montana' },
  { city: 'Omaha', state: 'Nebraska' },
  { city: 'Las Vegas', state: 'Nevada' },
  { city: 'Reno', state: 'Nevada' },
  { city: 'Albuquerque', state: 'New Mexico' },
  { city: 'Buffalo', state: 'New York' },
  { city: 'New York City', state: 'New York' },
  { city: 'Winston-Salem', state: 'North Carolina' },
  { city: 'Cincinnati', state: 'Ohio' },
  { city: 'Cleveland', state: 'Ohio' },
  { city: 'Columbus', state: 'Ohio' },
  { city: 'Oklahoma City', state: 'Oklahoma' },
  { city: 'Portland', state: 'Oregon' },
  { city: 'Philadelphia', state: 'Pennsylvania' },
  { city: 'Pittsburgh', state: 'Pennsylvania' },
  { city: 'Columbia', state: 'South Carolina' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'El Paso', state: 'Texas' },
  { city: 'Houston', state: 'Texas' },
  { city: 'Lubbock', state: 'Texas' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'Salt Lake City', state: 'Utah' },
  { city: 'Richmond', state: 'Virginia' },
  { city: 'Seattle', state: 'Washington' },
  { city: 'Spokane', state: 'Washington' },
  { city: 'Charleston', state: 'West Virginia' },
  { city: 'Milwaukee', state: 'Wisconsin' },
];

const SMALL = [
  { city: 'Fresno', state: 'California' },
  { city: 'Tallahassee', state: 'Florida' },
  { city: 'Pocatello', state: 'Idaho' },
  { city: 'Peoria', state: 'Illinois' },
  { city: 'Wichita', state: 'Kansas' },
  { city: 'Shreveport', state: 'Louisiana' },
  { city: 'Portland', state: 'Maine' },
  { city: 'Billings', state: 'Montana' },
  { city: 'Albany', state: 'New York' },
  { city: 'Syracuse', state: 'New York' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Aberdeen', state: 'South Dakota' },
  { city: 'Burlington', state: 'Vermont' },
  { city: 'Roanoke', state: 'Virginia' },
  { city: 'Cheyenne', state: 'Wyoming' },
  ...COMMON,
];

const REGULAR = [...COMMON];

exports.TRIAL_CITIES = {
  REGULAR,
  SMALL,
};
