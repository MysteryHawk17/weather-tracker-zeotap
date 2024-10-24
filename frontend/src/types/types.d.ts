export interface IWeatherData {
  city: {
    name: string;
    countryCode: string;
    lat: number;
    lon: number;
  };
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  visibility: number;
  humidity: number;
  pressure: number;
  weatherCondition: {
    main: string;
    description: string;
    icon: string;
    id: number;
  }[];
  createdAt: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  location: string;
  preferredTemperatureUnit: "Celsius" | "Fahrenheit";
  thresholds: {
    maxTemperature: number;
    minTemperature: number;
    condition: string;
  };
  notificationSettings: { email: boolean };
  notificationContact: { email: string };
}

export interface INotification {
  userId: string;
  type: "Email" | "SMS";
  message: string;
  sentAt: Date;
}

export interface IDailySummary {
  city: {
    name: string;
    countryCode: string;
    lat: number;
    lon: number;
  };
  date: string;
  averageTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  dominantWeatherCondition: string;
  weatherConditionCount: { [condition: string]: number };
}

export interface ICity {
  _id: string;
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
}


export interface IThresholds {
  maxTemperature: number;
  minTemperature: number;
  condition: string;
}

export interface INotificationSettings {
  email: boolean;
}

export interface IRegistrationData {
  name: string;
  email: string;
  password: string;
  location: string;
  preferredTemperatureUnit: string;
  thresholds: IThresholds;
  notificationSettings: INotificationSettings;
}