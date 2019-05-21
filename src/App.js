import React from 'react';
import './App.css';
import {AppStore} from './component/AppStore.jsx';
import 'antd/dist/antd.css';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function App() {
  return (
    <div className="App">
        <AppStore/>
    </div>
  );
}

export default App;
