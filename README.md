# Weather Application

This weather application provides users with real-time weather updates, historical weather trends, and customizable preferences. It fetches daily weather data every 5 minutes and offers a 7-day weather summary. Users can also view historical trends through graphs and receive alerts via AWS SES, managed asynchronously with Redis.

## Features

### 1. Real-Time Daily Weather Updates

- **Frequency:** Weather data is fetched from the API every 5 minutes.
- **Information:** Users get real-time updates on the current weather, including temperature, humidity, wind speed, and general conditions.

### 2. 7-Day Weather Summary

- **Summary:** The application displays a summarized report of weather data for the last 7 days.
- **Data Points:** Users can review key metrics such as high/low temperatures, precipitation, and wind conditions.

### 3. Historical Weather Trends (Graph Visualization)

- **Graph:** Users can visualize historical weather trends, including temperature variations and precipitation over time.
- **Trend Analysis:** The graph helps users spot weather patterns and fluctuations, enabling them to plan for upcoming conditions.

### 4. Alerts via AWS SES

- **Email Notifications:** Weather alerts (e.g., storm warnings, significant temperature drops) are sent to users via email.
- **Asynchronous Handling:** Redis is used to handle these email alerts asynchronously, ensuring fast, scalable communication.

### 5. User Preferences

- **Customization:** Users can set personal preferences for alerts, such as the tempreture they want to be notified at .

- **Location & Frequency:** Users can specify their location they want to receive updates.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (for user preferences), Redis (for asynchronous processing)
- **Weather Data:** Third-party weather API
- **Alerts/Notifications:** AWS SES (for sending email notifications)
- **Graphing Library:** Recharts for visualizing historical trends
- **Queue:** Redis (for handling asynchronous jobs)

## Installation and Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mysteryhawk17/weather-app.git
   cd weather-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   - Get an API key from a weather API provider (e.g., OpenWeatherMap).
   - Create a `.env` file in the root directory for backend environment variables and add the following:
     ```bash
     # Backend Environment Variables
       MONGODB_URI=yout_mongodb_uri
       JWT_SECRET=yout_jwt_secret
       OPENWEATHERMAP_API_KEY=yout_openweathermap_api_key
       PORT=8000
       REDIS_HOST=localhost
       REDIS_PORT=6379
       REDIS_PASSWORD="" # Leave empty if no password is set
       EMAIL=your_aws_email
       SES_REGION=your_aws_region
       AMAZON_SECRET_KEY=your_aws_secret_key
       AMAZON_ACCESS_KEY=your_aws_access_key
     ```
   - If you have a frontend, create a `.env.frontend` file in the root directory for frontend environment variables and add the following:
     ```bash
     # Frontend Environment Variables
     VITE_BACKEND_API=your_backend_api_url
     ```

4. **Run the Application:**

   ```bash
   npm start
   ```

5. **Optional:** Configure Redis and AWS SES for email alerts:
   - Set up an AWS SES account for sending emails.
   - Ensure Redis is properly set up for handling background jobs.

## Usage

- **Weather Updates:** Once the app is running, weather data will be fetched automatically every 5 minutes.
- **7-Day Summary:** Visit `/summary` to view the weather summary for the past 7 days.
- **Historical Trends:** Navigate to `/trends` to view historical trends through graphs.
- **User Preferences:** Go to `/settings` to configure user-specific weather alerts and preferences.

## Contribution

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a pull request

## License

This project is licensed under the MIT License.
