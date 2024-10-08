import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

// move out of App fx so it only runs once
// localStorage runs synchronously -- no need to useEffect
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
// returns array of place objects based on array of stored Ids
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id))

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [available, setAvailablePlaces]  = useState([]);
  // used storedplaces as init value
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  
  // does not return a value
  // two args - fx that wraps side effect code
  // callback executed AFTER every component execution
  useEffect(() => {
    // side effect because not related to returning renderable comp
    // does not finish instantly; 
    navigator.geolocation.getCurrentPosition((position) => {
    // fx executed once location fetched
    const sortedPlaces = sortPlacesByDistance(
      AVAILABLE_PLACES,
      position.coords.latitude,
      position.coords.longitude
    );

    // updating state will have react re-ex comp
    // which will pull loc again and update state again
    // infinite loop
    setAvailablePlaces(sortedPlaces);
    // array of dependencies as second arg
    // define array -- react looks at dependencies
    // if dependency values change
    // empty array will remain unchanged so
    // effect isn't re-executed; executed once 
    // after App function executes
    // if dependencies omitted, useEffect will re-execute
    // after every App render
    })}, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // store data is not directly related to rendering app
    // no updates to state
    // can't use hook inside nested functions
    // hooks must be used directly in function root level
    // no update to state -- so no inf loop
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    
    // check to ensure id doesn't already exist in storage
    if (storedIds.indexOf(id) === -1){
      // built-into browser -- store data in browser
      // first arg - string identifier
      // second arg - string val that should be stored
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
      //console.log(storedIds);
    }


  }

  // fx not recreated every time component deploys w/ useCallback
  // unless dependencies change
  // first arg = fx
  // second arg = array of dependencies (prop or state vals used in fx)
  const handleRemovePlace =  useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);
    
    // retreive stored ids
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)))
  }, []) // no state or prop features updated by fx

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={AVAILABLE_PLACES}
          fallbackText="Sorting places by distance...'"
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
