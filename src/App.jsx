import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'


function App() {
 
  const [name, setName] = useState("");
  const [users , setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users") 
      .then((res) => res.json())                        
      .then((data) => setUsers(data));                  
  }, []); 

  return (
  <div>
    {users.map((user) => (
      <div key={user.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    ))}
  </div>
);
}

export default App;