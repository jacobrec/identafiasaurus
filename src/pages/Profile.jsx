import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Frame = (props) => <div className="jframe">
                           {props.children}
                         </div>;

const Profile = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    (async () => {
      const result = await axios.get('/api/profile');
      setData(result.data);
    })()
  }, []);
  console.log(data)

  return <Frame>
           <h1>{data.username}</h1>
           <h2>{data.email}</h2>
           <p>You posted {data.findings} findings </p>
         </Frame>;
}

export default Profile;
