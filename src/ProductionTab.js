import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonthlyTrendChart from './MonthlyTrendChart';
import './ProductionTab.css';

const ProductionTab = ({ selectedSite }) => {

    const [productionData, setProductionData] = useState(null);
    const siteAData = {
        azimuth: '0',
        system_capacity: '239,113',
        losses: '14',
        array_type: '2',
        module_type: '1',
        gcr: '0.4',
        dc_ac_ratio: '1.2',
        inv_eff: '99.0',
        radius: '0',
        dataset: 'nsrdb',
        tilt: '0',
        address: 'Los Banos, CA',
        soiling: [
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
          3.1,
        ],
        albedo: '0.2',
        bifaciality: '0.9',
      };
    
      const siteBData = {
        azimuth: '0',
        system_capacity: '132,344',
        losses: '14',
        array_type: '2',
        module_type: '1',
        gcr: '0.4',
        dc_ac_ratio: '1.2',
        inv_eff: '99.0',
        radius: '0',
        dataset: 'nsrdb',
        tilt: '0',
        address: 'Boulder City, NV',
        soiling: [
          2.3,
          2.6,
          1.8,
          2.1,
          1.2,
          0.9,
          1.9,
          0.8,
          0.5,
          1.6,
          2.5,
          2.1,
        ],
        albedo: '0.2',
        bifaciality: '0',
      };
    
      const data = selectedSite.name === 'Site A' ? siteAData : siteBData;
console.log(data)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const apiParams = {
                api_key: 'PJqwBcadoWBsZpNjZwsLqtFUfjQs8pLHTGSlauT2',
                azimuth: data.azimuth,
                system_capacity: parseInt(data.system_capacity,10),
                losses: data.losses,
                array_type: data.array_type,
                module_type: data.module_type,
                gcr: data.gcr,
                dc_ac_ratio: data.dc_ac_ratio,
                inv_eff: data.inv_eff,
                radius: data.radius,
                dataset: data.dataset,
                tilt: data.tilt,
                address: data.address,
                soiling: data?.soiling?.join('|'),
                albedo: data.albedo,
                bifaciality: data.bifaciality,
              };
            // Make the API call with the prepared parameters
        const response = await axios.get('https://developer.nrel.gov/api/pvwatts/v8.json', {
            params: apiParams,
          });
          setProductionData(response.data);
        } catch (error) {
          console.log('Error fetching production data:', error);
        }
      };
  
      if (selectedSite) {
        fetchData();
      }
    }, [selectedSite]);
 
const outputs = {
    ac_monthly:productionData?.outputs.ac_monthly,
    poa_monthly:productionData?.outputs.poa_monthly
   
  };

  const renderMonthlyData = () => {
    if (!productionData) {
      return null;
    }

    const { ac_monthly, poa_monthly } = productionData.outputs;

    return (
      <table className="production-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>POA (kWh)</th>
            <th>AC System Output (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {ac_monthly.map((acValue, index) => (
            <tr key={index}>
              <td>{getMonthName(index)}</td>
              <td>{poa_monthly[index]}</td>
              <td>{acValue}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Total</td>
            <td>{calculateTotal(poa_monthly)}</td>
            <td>{calculateTotal(ac_monthly)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[monthIndex];
  };

  const calculateTotal = (values) => {
    return values.reduce((acc, value) => acc + value, 0);
  };

  return (
    <>
    <div className='production-chart'>
      <h2>{selectedSite.name}</h2>
      <MonthlyTrendChart monthlyPOA={outputs.poa_monthly} monthlyAC={outputs.ac_monthly} />
    </div>
     <div className="production-tab">
     <h2>Production</h2>
     {renderMonthlyData()}
   </div>
   </>
  );
};

export default ProductionTab;
