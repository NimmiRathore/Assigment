import React,{useState,useEffect} from 'react';
import './App.css';
import { MDBTable,MDBTableHead ,MDBTableBody,MDBRow,MDBCol,MDBContainer,MDBBtn,MDBBtnGroup} from 'mdb-react-ui-kit';
import axios from 'axios';
function App() {
  const [data,setData]= useState([]);
  const [catchDetails,setCatchDetails]= useState([]);
  const [resources,setResources]= useState([]);
  const [application,setApplication]= useState([]);
  const [searchKey,setSearchKey]= useState([]);
  const [sortValue,setSortValue]=useState('');
  const sortOpion = ['Application','Resource']
  useEffect(()=>{
     fetchData()
  },[])
  useEffect(()=>{
    mergeData();
 },[application]);
 const fetchData=async()=>{
  loadResourceData();
     loadApplicationData();
 }
  const loadResourceData = async()=>{
        return await axios.get('https://engineering-task.elancoapps.com/api/resources').then((res)=>{
           setResources(res.data);
        }).catch(err=>console.log(err))
  }
  const loadApplicationData = async()=>{
    return await axios.get('https://engineering-task.elancoapps.com/api/applications').then((res)=>{
      setApplication(res.data);
    }).catch(err=>console.log(err))
  }
  const mergeData = async()=>{
      const data=[];
      const length = resources.length;
      for(let i=0;i<length;i++){
        data.push({'application':application[i],'resource':resources[i],status:i%2?'InActive':'Active'})
      }
      setData(data);
      setCatchDetails([...data]);
    }
    const handelReset = ()=>{
          fetchData();
          setSearchKey('')
    }
    const hadelSearch = async(e)=>{
      e.preventDefault();
      // return await axios.get(`https://engineering-task.elancoapps.com/api/applications?applicationName=${searchKey}`).then((res)=>{
      //   setApplication(res.data);
      //   setSearchKey('');
      // }).catch(err=>console.log(err)) this api always giving all data
      
      setData(catchDetails.filter(item => {
       console.log(item.application);
        return item.application === searchKey}))
    }
    const handelSort = async(e)=>{
      e.preventDefault();
      let value = e.target.value;
      setSortValue(value);
      setData([...data.sort((a,b)=> a[value]=b[value])])
    }
    const handelFilter = async(status)=>{
        setData(catchDetails.filter(item=> item.status=== status));
    }
  return (
    <MDBContainer>
      <div>
<h2 style={{marginBottom:'10px'}} className='text-center'>
  Assigment
</h2>
<form style={{margin:'auto',padding:'15px',maxWidth:'400px',alignContent:'center'}}
className='d-flex input-group w-auto'
onSubmit={hadelSearch}
>
<input 
type="text"
className='form-control'
placeholder='search Application...'
value={searchKey}
onChange={(e)=>setSearchKey(e.target.value)}
/>
<MDBBtnGroup>
  <MDBBtn type='submit' color='dark'>
    Search
  </MDBBtn>
  <MDBBtn className='mx-2' color='info' onClick={()=>handelReset()}>
    Reset
  </MDBBtn>
</MDBBtnGroup>
</form>
<MDBRow style={{marginBottom:'10px'}}>
        <MDBCol size="8">
<h5>
  Sort By
</h5>
<select style={{width:"50%",borderRadius:"2px",height:'35px'}}
onChange={ handelSort}
>
<option>
  Please Select Option
</option>
 {
  sortOpion.map((item,index)=>(
    <option key={index} value={item}>
{item}
    </option>
  ))
 }
</select>
        </MDBCol>
        <MDBCol size="4">
<h5>Filter By Status</h5>
<MDBBtnGroup>
  <MDBBtn color='success' onClick={()=>handelFilter('Active')}>Active</MDBBtn>
  <MDBBtn color='danger' onClick={()=>handelFilter('InActive')}>InActive</MDBBtn>
</MDBBtnGroup>
        </MDBCol>
      </MDBRow>
<MDBRow>
  <MDBCol size="12">
<MDBTable>
  <MDBTableHead dark>
<tr>
<th scope='col'>
  S.No.
  </th>
  <th scope='col'>
   Resources
  </th>
  <th scope='col'>
   Application
  </th>
  <th scope='col'>
   Status
  </th>
</tr>
  </MDBTableHead>
  {data.length===0?(<MDBTableBody className='align-center mb-0'>
<tr>
  <td colSpan={3} className='text-center mb-0'>
NO Data Found
  </td>
</tr>
  </MDBTableBody>):(
    data.map((item,index)=>(<MDBTableBody key={index}>
    <tr>
      <th scope='row'>{index+1}</th>
      <td>{item.resource}</td>
      <td>{item.application}</td>
      <td>{item.status}</td>
    </tr>
    </MDBTableBody>))
  )}
</MDBTable>
  </MDBCol>
</MDBRow>
      </div>
    
    </MDBContainer>
  );
}

export default App;
