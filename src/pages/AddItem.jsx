import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AddItem = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios.get('/api/findings');
      setItems(result.data.items);
    })()
  }, []);
  console.log(items)

  return <div>
           <h1>Add finding</h1>
         </div>;
}

export default AddItem;
