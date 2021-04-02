import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Detector } from "react-detect-offline";
import './App.css';

function App() {
  const [appState, setAppState] = useState({
    loading: false,
    stateData: null,
    name: '',
    found: false,
    cityFound:null
  })

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = "https://api.covid19india.org/data.json";
    axios.get(apiUrl)
      .then(reponse => {
       
        const statewiseData = reponse.data.statewise;
        localStorage.setItem('stateData', JSON.stringify(statewiseData))
        setAppState({ loading: false, stateData: statewiseData });
        console.log(stateData);
      })
      .catch(error => {
        setAppState({ loading: false });
        console.log('Something went wrong');
      })
  }, []);

  const { loading } = appState;
  const stateData = JSON.parse(localStorage.getItem('stateData'));
  
  console.log(appState);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log(event);
    let i = stateData.length;
    console.log(i);
    while(i--){
      if(appState.name === stateData[i].state.toLowerCase())
      {
            const cityData = stateData[i];
            console.log(cityData);
            setAppState({found:true,cityFound:cityData});
            break;
        }
    }
    }

  
  return (
    <Detector
      render={({ online }) => (
        <div className={online ? "App" : "Offline-App"}>
          <div className="container">
            <h2 className="app-title">Covid-19 India</h2>
            {
              stateData &&
              <>
                <div className="card confirmed">
                  <h4>Confirmed</h4>
                  <h2>
                    {stateData[0].confirmed}
                    <small>
                      (+{stateData[0].deltaconfirmed})
                    </small>
                  </h2>
                </div>
                <div className="card active">
                  <h4>Active</h4>
                  <h2>{stateData[0].active}</h2>
                </div>
                <div className="card recovered">
                  <h4>Recovered</h4>
                  <h2>
                    {stateData[0].recovered}
                    <small>
                      (+{stateData[0].deltarecovered})
                    </small>
                  </h2>
                </div>
                <div className="card deceased">
                  <h4>Deceased</h4>
                  <h2>
                    {stateData[0].deaths}
                    <small>
                      (+{stateData[0].deltadeaths})
                    </small>
                  </h2>
                </div>
                <div className ="card-search">
                  <h4>Check the status in your state below</h4>
                  <br></br>
                  <form onSubmit = {onSubmitHandler}> 
                    <input type='text'placeholder = 'Enter city'onChange={(e)=>{ setAppState({name : e.target.value})}}>

                    </input>
                    <button type='submit'>Check</button>
                  </form></div>
                  <div>
                    {appState.found ? 
                          <>
                              <div className="card confirmed">
                              <h4>Confirmed</h4>
                              <h2>
                                {appState.cityFound.confirmed}
                                <small>
                                  (+{appState.cityFound.deltaconfirmed})
                                </small>
                              </h2>
                              </div> 
                              <div className="card active">
                          <h4>Active</h4>
                          <h2>{appState.cityFound.active}</h2>
                        </div>
                        <div className="card recovered">
                          <h4>Recovered</h4>
                          <h2>
                            {appState.cityFound.recovered}
                            <small>
                              (+{appState.cityFound.deltarecovered})
                            </small>
                          </h2>
                        </div>
                        <div className="card deceased">
                          <h4>Deceased</h4>
                          <h2>
                            {appState.cityFound.deaths}
                            <small>
                              (+{appState.cityFound.deltadeaths})
                            </small>
                          </h2>
                        </div>
                      </>
                      : 
                      <div className="app-searching"> Searching..</div>
                      } 
                    </div>
              </>
            }
            {!online &&
              <span className="offline-text">You are currently offline</span>
            }
          </div>
        </div>        
      )}
    />
  );
}

export default App;
