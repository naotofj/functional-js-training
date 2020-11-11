import initModel from './Model';
import update from './Update';
import view from './View';
import app from './App';

const node = document.getElementById('app');

if (module.hot) {
    module.hot.accept('./App', function () {
      setTimeout(render);
    });
  }
  
app(initModel, update, view, node);