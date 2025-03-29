import React, {useState} from 'react';
import Tasks from './components/Tasks';
import Auth from './components/Auth';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  return (
    <div className="App">
      <h1>To-Do List App</h1>
      {loggedIn ? <Tasks /> : <Auth onLogin={()=>setLoggedIn(true)}/>}
    </div>
  );
}

export default App;
