import * as R from 'ramda';

const MSGS = {
  ADD_LOCATION: 'ADD_LOCATION',
  REMOVE_LOCATION: 'REMOVE_LOCATION',
  INPUT_LOCATION: 'INPUT_LOCATION',
  HTTP_SUCCESS: 'HTTP_SUCCESS',
  HTTP_ERROR: 'HTTP_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};


const APPID = 'INSERT_API_KEY_HERE';

function weatherUrl(city) {
  return `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APPID}&units=metric`;
}

export function inputLocationMsg(input) {
  return {
    type: MSGS.INPUT_LOCATION,
    input,
  };
}

export const addLocationMsg = {
  type: MSGS.ADD_LOCATION,
};

export function removeLocationMsg(id) {
  return {
    type: MSGS.REMOVE_LOCATION,
    id,
  };
}

const httpSuccessMsg = R.curry((id, response) => ({
  type: MSGS.HTTP_SUCCESS,
  id,
  response,
}));

function httpErrorMsg(error) {
  return {
    type: MSGS.HTTP_ERROR,
    error,
  };
}

export const clearErrorMsg = {
  type: MSGS.CLEAR_ERROR,
};

function update(msg, model) {
  switch (msg.type) {
    case MSGS.INPUT_LOCATION:
      const { input } = msg;
      return { ...model, inputLocation: input };
    case MSGS.ADD_LOCATION:
      return addLocation(model);
    case MSGS.REMOVE_LOCATION:
      return removeLocation(model, msg);
    case MSGS.HTTP_SUCCESS:
      return showTemps(model, msg);
    case MSGS.HTTP_ERROR: {
      const { error } = msg;
      return { ...model, error: error.message };
    }
    case MSGS.CLEAR_ERROR: {
      return { ...model, error: null };
    }
    default:
      return model;
  }
}

function showTemps(model, msg) {
  const { id, response } = msg;
  const { locations } = model;
  const { temp, temp_min, temp_max } = R.pathOr({}, ['data', 'main'], response);
  const updatedLocations = R.map((location) => {
    if (location.id === id) {
      return {
        ...location,
        temp: Math.round(temp),
        low: Math.round(temp_min),
        high: Math.round(temp_max),
      };
    }
    return location;
  }, locations);
  return {
    ...model,
    locations: updatedLocations,
  };
}

function addLocation(model) {
  const { inputLocation, nextId } = model;
  const newLocation = {
    id: nextId,
    name: inputLocation,
    temp: '?',
    low: '?',
    high: '?',
  };
  return [
    {
      ...model,
      locations: [...model.locations, newLocation],
      inputLocation: '',
      nextId: nextId + 1,
    },
    {
      request: { url: weatherUrl(inputLocation) },
      successMsg: httpSuccessMsg(nextId),
      errorMsg: httpErrorMsg,
    },
  ];
}

function removeLocation(model, msg) {
  const { id } = msg;
  const locations = R.filter((location) => location.id !== id, model.locations);
  return { ...model, locations };
}

export default update;
