import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import axios from 'axios';
import * as R from 'ramda';

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    const updates = update(msg, model);
    const isArray = R.type(updates) === 'Array';
    model = isArray ? updates[0] : updates;
    const command = isArray ? updates[1] : null;
    httpEffects(dispatch, command);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

async function httpEffects(dispatch, command) {
  if (command === null) {
    return;
  }
  try {
    const { request, successMsg } = command;
    const response = await axios(request);
    dispatch(successMsg(response));
  } catch (error) {
    const { errorMsg } = command;
    dispatch(errorMsg(error));
  }
}

export default app;
