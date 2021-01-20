import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios.get('/api/findings');
      setItems(result.data.items);
    })()
  }, []);
  console.log(items)

  return <div>
           <h1>All findings</h1>
           <ul>
             { items.map(i => <li>{JSON.stringify(i)}</li>) }
           </ul>
         </div>;
}

export default ItemList;
