import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  inputLocationMsg,
  addLocationMsg,
  removeLocationMsg,
  clearErrorMsg,
} from './Update';

const { div, h1, pre, input, button, form, label, ul, li, i } = hh(h);

function locationForm(dispatch, model) {
  const { inputLocation } = model;
  return form(
    {
      onsubmit: (e) => {
        e.preventDefault();
        dispatch(addLocationMsg);
      },
    },
    [
      label({ className: 'f6 b db mb2' }, 'Location'),
      input({
        className: 'pa2 w-60',
        value: inputLocation,
        oninput: (e) => {
          dispatch(inputLocationMsg(e.target.value));
        },
      }),
      button({ className: 'pv2 ph3 br1 mh2', type: 'submit' }, 'Add'),
    ]
  );
}

function cell(className, label, data) {
  return div({ className }, [div({ className: 'f7 b' }, label), div({}, data)]);
}

function locationsList(dispatch, model) {
  const { locations } = model;
  const partialLocationIntem = R.partial(locationItem, [dispatch]);
  return ul(
    { className: 'list pl0 ml0 ba b--light-silver br' },
    R.map((location) => partialLocationIntem(location), locations)
  );
}

function error(dispatch, model) {
  if (!model.error) {
    return null;
  }
  return div({ className: 'pa2 mv2 bg-red white relative' }, [
    model.error,
    i({
      className:
        'white absolute top-0 right-0 mt1 mr1 fa fa-remove pointer black-40',
      onclick: () => dispatch(clearErrorMsg),
    }),
  ]);
}

function locationItem(dispatch, location) {
  const { name, temp, low, high, id } = location;
  return li(
    { className: 'pa3 bb b--light-silver flex justify-between relative' },
    [
      cell('w-60 tl', 'Location', name),
      cell('w-10 tc', 'Temp', temp),
      cell('w-10 tc', 'Low', low),
      cell('w-10 tc mr2', 'High', high),
      i({
        className:
          'relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40',
        onclick: () => {
          dispatch(removeLocationMsg(id));
        },
      }),
    ]
  );
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    error(dispatch, model),
    locationForm(dispatch, model),
    locationsList(dispatch, model),
  ]);
}

export default view;
