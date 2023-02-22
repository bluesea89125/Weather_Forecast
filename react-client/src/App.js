import React, { useState } from 'react';
import { Box, Select, MenuItem, Container, Grid, Link, SvgIcon, Typography } from '@mui/material';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';

import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const [city, setCity] = useState("");
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = async (event) => {
    setCity(event.target.value);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/getWeatherInfo/city?city=${event.target.value}`,
        {
          method: "GET",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
          })
        }
      );

      const weatherData = await response.json();

      const currentDate = transformDateFormat();
      const date = new Date();
      let dt_now = Math.floor(date.getTime() / 1000);

      const todayWeatherData = weatherData.current;
      const todayForecastWeatherData = weatherData.forecast.forecastday[0].hour;
      const twoWeeksForecastWeatherData = weatherData.forecast.forecastday;

      const all_today_forecasts_list = getTodayForecastWeather(
        todayForecastWeatherData,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        twoWeeksForecastWeatherData,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: event.target.value, ...todayWeatherData });
      setWeekForecast({
        city: event.target.value,
        list: all_week_forecasts_list,
      });
     } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: '100px', sm: '120px', md: '140px' } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'rgba(255,255,255, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Explore current weather data and two weeks forecast of several cities.
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '0 auto',
        padding: '1rem 0 3rem',
        marginBottom: '1rem',
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: '400',
                fontSize: { xs: '40px', sm: '30px' },
                color: 'rgba(255, 255, 255, 1)',
                lineHeight: 1,
                paddingRight: '2px',
                fontFamily: 'Poppins',
              }}
            >
              THE WEATHER FORECASTING
            </Typography>
            
            <UTCDatetime />
            <Link
              href="https://github.com/Amin-Awinti"
              target="_blank"
              underline="none"
              sx={{ display: 'flex' }}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: '20px', sm: '22px', md: '26px' },
                  color: 'white',
                  '&:hover': { color: '#2d95bd' },
                }}
              />
            </Link>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '70%',
              marginBottom: '1rem',
            }}
          >
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: '400',
                fontSize: { xs: '30px', sm: '24px' },
                color: 'rgba(255, 255, 255, 1)',
                lineHeight: 1,
                marginLeft: '100px',
                paddingRight: '2px',
                fontFamily: 'Poppins',
              }}
            >
              Please Select City You Want.
            </Typography>
            <Select
              value={city}
              label="City"
              onChange={handleChange}
              sx={{
                width: '200px',
                fontWeight: '400',
                color: 'white',
                lineHeight: 1,
                paddingRight: '2px',
                fontFamily: 'Poppins',
              }}
            >
              <MenuItem value="Reno, US">Reno, Nevada</MenuItem>
              <MenuItem value="Austin, US">Austin</MenuItem>
              <MenuItem value="Tampa, US">Tampa</MenuItem>
            </Select>
          </Box>
          
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
