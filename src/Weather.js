import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, CardContent } from '@material-ui/core';
import SiteMap from './SiteMap';
import ProductionTab from './ProductionTab';
import './Weather.css'
import HistoricalGraph from './HistoricalGraph';
const SiteDetails = () => {
    const siteData = [
        {
            name: 'Site A',
            latitude: 37.0,
            longitude: -121.0,
            elevation: '137.16',
            city: 'Los Banos',
            state: 'CA',
            systemCapacity: '239113',
            timeOffset: -8,
            weather: null,
            historicalWeather: [], // Array to store historical weather data
        },
        {
            name: 'Site B',
            latitude: 35.85,
            longitude: -114.97,
            elevation: '527.3',
            city: 'Boulder City',
            state: 'NV',
            systemCapacity: '132344',
            timeOffset: -8,
            weather: null,
            historicalWeather: [], // Array to store historical weather data
        },
    ];

    const [selectedSite, setSelectedSite] = useState(siteData[0]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [historicalData, setHistoricalData] = useState(null);


    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiKey = '08215013bab68950d441fc1a09410d6d';
            const { latitude, longitude } = selectedSite;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data, 'data')
                const weatherInfo = {
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    windspeed: data.wind.speed
                };

                setSelectedSite((prevSelectedSite) => ({
                    ...prevSelectedSite,
                    weather: weatherInfo,
                }));
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [selectedSite.name]);

    const fetchHistoricalWeatherData = async (site) => {
        const apiKey = '08215013bab68950d441fc1a09410d6d';
        const { latitude, longitude } = selectedSite;
        const currentDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const start = currentDate - 86400; // Start date is 1 day ago
        const end = currentDate; // End date is today

        const url = 'https://api.openweathermap.org/data/2.5/forecast?q=mumbai&appid=e4bb58a78743177ba3c9f9553c79ad51';

        try {
            const response = await fetch(url);
            const data = await response.json();
            const historicalWeatherData = data.list.map((weather) => ({
                date: new Date(weather.dt * 1000).toLocaleDateString(), // Convert timestamp to date string
                temperature: weather.main.temp,
                humidity: weather.main.humidity,
                windspeed: weather.wind.speed
            }));
            setHistoricalData(historicalWeatherData)
            return historicalWeatherData;
        } catch (error) {
            console.error('Error fetching historical weather data:', error);
            return [];
        }
    };


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);

        if (newValue === 1 && selectedSite.historicalWeather.length === 0) {
            fetchHistoricalWeatherData();
        }
    };

    const handleSiteChange = (event) => {
        const siteName = event.target.value;
        const site = siteData.find((site) => site.name === siteName);
        setSelectedSite(site);
    };

    useEffect(() => {
        // Make the API call and fetch the historical data
        const fetchData = async () => {
            try {
                fetchHistoricalWeatherData();
            } catch (error) {
                console.log('Error fetching historical data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Site Details</h1>
            <div className="site-details" style={{ display: 'flex' }}>
                <div className="site-select" style={{ width: '200px' }}>
                    <label htmlFor="site">Select a site:</label>
                    <select id="site" value={selectedSite.name} onChange={handleSiteChange}>
                        {siteData.map((site) => (
                            <option key={site.name} value={site.name}>
                                {site.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="tab-content" style={{ marginLeft: '16px' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                        <Tab label="Maps" />
                        <Tab label="Overview" />
                        <Tab label="Production" />
                    </Tabs>
                    <div>
                        {selectedTab === 0 && (
                            // Maps tab
                            <SiteMap siteData={siteData} selectedSite={selectedSite} />
                        )}
                        {selectedTab === 1 && (
                            <Card>
                                <CardContent>
                                    <h2 className="site-name">{selectedSite.name}</h2>
                                    <p className="site-info">Latitude: {selectedSite.latitude}</p>
                                    <p className="site-info">Longitude: {selectedSite.longitude}</p>
                                    <p className="site-info">Elevation: {selectedSite.elevation}</p>
                                    <p className="site-info">City: {selectedSite.city}</p>
                                    <p className="site-info">State: {selectedSite.state}</p>
                                    <p className="site-info">System Capacity: {selectedSite.systemCapacity}</p>
                                    <p className="site-info">Time Offset: {selectedSite.timeOffset}</p>
                                    <strong>Real time weather</strong>
                                    <p className="site-info">
                                        Temperature:{' '}
                                        {selectedSite.weather ? selectedSite.weather.temperature : 'Loading...'}
                                    </p>
                                    <p className="site-info">
                                        Humidity:{' '}
                                        {selectedSite.weather ? selectedSite.weather.humidity : 'Loading...'}
                                    </p>
                                    <p className="site-info">
                                        Windspeed:{' '}
                                        {selectedSite.weather ? selectedSite.weather.windspeed : 'Loading...'}
                                    </p>
                                    <div>
                                        {historicalData ? (
                                            <HistoricalGraph data={historicalData} />
                                        ) : (
                                            <p>Loading historical data...</p>
                                        )}
                                    </div>

                                </CardContent>
                            </Card>
                        )}
                        {selectedTab === 2 && (
                            <Card>
                                <CardContent className="tab-item">
                                    <ProductionTab selectedSite={selectedSite} />
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteDetails;
