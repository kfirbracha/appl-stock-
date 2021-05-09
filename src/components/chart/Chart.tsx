import { Line} from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { ChartData } from 'chart.js';
import { NetworkService } from '../../services/networkService';
import { IProps, ISuccessResponse } from '../../interfaces/interfaces';


enum period {
  FIVE_MIN = 5,
  ONE_MIN = 1,
  ONE_HOUR = 1,
  ONE_WEEK = 30
}
const DefaultChart = (props:IProps) => {
    const [chartData,setChartData]=useState<ChartData>({datasets:[]});
    const [currentChoice,setCurrentChoice] = useState<number>(period.ONE_MIN);
    const [precision ,setPrecision] =useState<string>('Minutes');
    const [currentCloseRate,setCurrentCloseRate]=useState<string>();

    useEffect(()=>{
        let getChartData = async () => {
            const chartDataFromUrl:ISuccessResponse[] = await NetworkService.getStockDetails(precision,currentChoice.toString());
            const today =new Date().getTime();
            let filteredArray;
            if(currentChoice === period.ONE_WEEK){
              let newArr =chartDataFromUrl.sort((a,b)=> a.StartDate === b.StartDate ?0 :1).map(val=>val.StartDate);
               filteredArray =chartDataFromUrl.sort((a,b)=>  a.StartDate === b.StartDate ?0 :1)
              .filter(({StartDate},index)=>  newArr.indexOf(StartDate) === index);
            }else{
               filteredArray =chartDataFromUrl.sort((a,b)=>new Date(a.Date).getTime() -today<new Date(b.Date).getTime()-today ?1 :0).slice(Math.max(chartDataFromUrl.length-7,1))
              setCurrentCloseRate(filteredArray[filteredArray.length -1].Close.toString())
              } 
              setChartData({labels:filteredArray.map(val=>currentChoice === period.ONE_WEEK?val.StartDate: val.StartTime),datasets:[{
                data:filteredArray.map(val=> +val.Close),
                label:'close',
                borderWidth:2,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
              }]
            })
     
        }
        getChartData()
        return () => {getChartData = async () =>{}}
    },[currentChoice,precision])

  const onChangeChartPreiod = (period:number,precision:string)=>{
    console.log(period,precision);
    setPrecision(precision)
    setCurrentChoice(period);

  }
    return <div style={{flex:1,flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-around'}}>
        <h1>APPL</h1>
        <h2>{currentCloseRate}</h2>
      </div>
    <div style={{display:'flex',justifyContent:'center',flexDirection:'row',marginTop:'1%',marginBottom:'3%'}}>
      <button style={{...styles.button ,borderBottom :currentChoice === period.FIVE_MIN?'1px solid black':0}} onClick={()=>onChangeChartPreiod(period.FIVE_MIN,'Minutes')}>5M</button>
      <button style={{...styles.button,borderBottom :currentChoice === period.ONE_MIN && precision === 'Minutes'?'1px solid black':0}} onClick={()=>onChangeChartPreiod(period.ONE_MIN,'Minutes')}>1M</button>
      <button style={{...styles.button,borderBottom :currentChoice === period.ONE_HOUR && precision === 'Hour'?'1px solid black':0}} onClick={()=>onChangeChartPreiod(period.ONE_HOUR,'Hour')}>1H</button>
      <button style={{...styles.button,borderBottom :currentChoice === period.ONE_WEEK?'1px solid black':0}} onClick={()=>onChangeChartPreiod(30,'Minutes')}
      >1W</button>
    </div>
    <div style={{display:'flex',textAlign:'center',justifyContent:'center'}}>
    <Line type='default'  style={{display:'flex',flexWrap:'wrap',maxHeight:'400px'}} data={chartData}/>
    </div>
    </div>

}

const styles = {
  button:{
    background:'transparent',
    border:'none'
  }
}

export default DefaultChart;