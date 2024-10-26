import React, { useState,useEffect } from 'react';
import './BMI.css'; // Add your custom CSS here

const BMI = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    sex: '',
    activity: ''
  });
  const [bmi, setBmi] = useState(null); // State to store the calculated BMI
  const [error, setError] = useState(''); // State to store error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100; // Convert height from cm to meters
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      return calculatedBmi.toFixed(2); // Return BMI rounded to 2 decimal places
    }
    return null;
  };

  const handleSubmit = (e) => {
    const { weight, height } = formData;

    // Validate inputs
    if (weight <= 0 || height <= 0) {
      setError('Weight and height must be positive numbers.');
      setBmi(null);
      return;
    }

    const calculatedBmi = calculateBMI(Number(weight), Number(height));
    setBmi(calculatedBmi); // Update the BMI state
    setError(''); // Clear any previous errors
  };

  const [users,setusers] = useState([]);

  useEffect(()=>{
    fetch('http://localhost/app-dev/bmi.php',{
      method:"GET",
      credentials:"include"
    })
    .then((response)=>response.json())
    .then((data)=>setusers(data))
  },[])

  return (
    <div className="bmi-calculator-container">
      <h1>BODY MASS INDEX</h1>
      <h2>Calculate Your BMI Now</h2>
      <form action="http://localhost/app-dev/bmi.php" method='post' onSubmit={handleSubmit} className="bmi-form">
        <div className="input-group">
          <input 
            type="number" 
            name="weight" 
            placeholder="Weight / KG" 
            value={formData.weight} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="height" 
            placeholder="Height / CM" 
            value={formData.height} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="age" 
            placeholder="Age" 
            value={formData.age} 
            onChange={handleChange} 
            required 
          />
          <select 
            name="sex" 
            value={formData.sex} 
            onChange={handleChange} 
            required
          >
            <option value="">Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="input-group">
          <select 
            name="activity" 
            value={formData.activity} 
            onChange={handleChange}
            style={{width:220}}
          >
            <option value="">Select an activity factor</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (exercise 4-5 days/week)</option>
            <option value="active">Active (daily exercise or intense exercise 3-4 times/week)</option>
            <option value="very active">Very Active (intense exercise 6-7 days/week)</option>
          </select>
          <input type="text" name='bmi' value={bmi} hidden/>
          <button type="submit" name='bmibutton' className="calculate-btn">CALCULATE NOW</button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
      
      {bmi !== null && (
        <div style={{display:"flex",gap:20,justifyContent:"center",alignItems:"center"}}>
          <h3 style={{fontSize:25}}>BMI : <span style={{ fontSize: 25, color: bmi < 18.5 || bmi > 24.9 ? 'red' : 'green' }}>{bmi}</span></h3>
          <p style={{fontSize:20}}>
            {bmi < 18.5 ? 'Underweight' : bmi <= 24.5 ? 'Normal weight' : 'Overweight'}
          </p>
        </div>
      )}  
      {users.length > 0 ? (
        <div className='bmitab'>
          <div className='bmit'>
            <h3>Sno</h3>
            <h3>Weight</h3>
            <h3>Height</h3>
            <h3 style={{position:"absolute",right:"30%"}}>Date</h3>
            <h3 style={{position:"absolute",right:0}}>BMI</h3>
          </div>
           {users.map((user,index)=>(
            <div className='bmitable'>
              <p>{index+1}</p>
              <p>{user.weight}</p>
              <p>{user.height}</p>
              <p>{user.date}</p>
              <p style={{ fontSize: 20,fontWeight:"bold",  color: parseFloat(bmi) < 18.5 || parseFloat(bmi) > 24.9 ? 'red' : 'green' }}>{user.bmi}</p>
            </div>
           ))}
        </div>
      ):(<p style={{marginTop:100}}>No record found. Calculate <span style={{color:"#e63946",fontSize:20,fontWeight:"bold"}}>BMI</span> to see your results.</p>)}
    </div>
  );
};

export default BMI;
