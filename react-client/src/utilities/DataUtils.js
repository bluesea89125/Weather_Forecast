export function groupBy(key) {
  return function group(array) {
    return array.reduce((acc, obj) => {
      const property = obj[key];
      const { date, ...rest } = obj;
      acc[property] = acc[property] || [];
      acc[property].push(rest);
      return acc;
    }, {});
  };
}

export function getAverage(array, isRound = true) {
  let average = 0;
  if (isRound) {
    average = Math.round(array.reduce((a, b) => a + b, 0) / array.length);
    if (average === 0) {
      average = 0;
    }
  } else average = (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2);

  return average;
}

export function getMostFrequentWeather(arr) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) =>
    hashmap[a] > hashmap[b] ? a : b
  );
}

export const descriptionToIconName = (desc, descriptions_list) => {
  let iconName = descriptions_list.find((item) => item.description === desc);
  return iconName.icon || 'unknown';
};

export const getWeekForecastWeather = (response, descriptions_list) => {
  let foreacast_data = [];
  let descriptions_data = [];

  if (!response || Object.keys(response).length === 0 || response.cod === '404')
    return [];
  else
    response?.slice().map((item, idx) => {
      descriptions_data.push({
        description: item.day.condition.text,
        date: item.date
      });
      foreacast_data.push({
        date: item.date,
        temp: item.day.maxtemp_c,
        humidity: item.day.avghumidity,
        wind: item.day.maxwind_mph,
        clouds: item.hour[0].cloud,
        icon: item.day.condition.icon,
      });
      return { idx, item };
    });
  
  const groupByDate = groupBy('date');
  let grouped_forecast_data = groupByDate(foreacast_data);
  let grouped_forecast_descriptions = groupByDate(descriptions_data);

  const description_keys = Object.keys(grouped_forecast_descriptions);

  let dayDescList = [];

  description_keys.forEach((key) => {
    let singleDayDescriptions = grouped_forecast_descriptions[key].map(
      (item) => item.description
    );
    let mostFrequentDescription = getMostFrequentWeather(singleDayDescriptions);
    dayDescList.push(mostFrequentDescription);
  });
  
  const forecast_keys = Object.keys(grouped_forecast_data);
  let dayAvgsList = [];

  forecast_keys.forEach((key, idx) => {
    dayAvgsList.push({
      date: key,
      temp: grouped_forecast_data[key][0].temp,
      humidity: grouped_forecast_data[key][0].humidity,
      wind: grouped_forecast_data[key][0].wind,
      clouds: grouped_forecast_data[key][0].clouds,
      description: dayDescList[idx],
      icon: grouped_forecast_data[key][0].icon
    });
  });

  return dayAvgsList;
};

export const getTodayForecastWeather = (
  response,
  current_date,
  current_datetime
) => {
  let all_today_forecasts = [];

  if (!response || Object.keys(response).length === 0 || response.cod === '404')
    return [];
  else
    response?.map((item) => {
      if (item.time > current_date) {
        all_today_forecasts.push({
          time: item.time.split(' ')[1].substring(0,5),
          icon: item.condition.icon,
          temperature: item.temp_c + ' °C',
        });
      }
      return all_today_forecasts;
    });

  return all_today_forecasts;
};
