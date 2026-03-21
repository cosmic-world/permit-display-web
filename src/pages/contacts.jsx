import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

export default function contacts() {
  return (
    <div className='d-flex w-100 h-100 justify-content-center align-items-center'>
    <Card className='card-style'>
      <CardContent 
      className='w-100 h-100 d-flex flex-column justify-content-center align-items-center' 
      style={{color: 'black', fontFamily:'Lucida Sans', fontSize: '2rem', fontStyle:'italic', fontWeight:'bold'}}>
        <label style={{marginBottom:'2rem', fontSize: '2.5rem', textTransform:'uppercase'}}>
          Tas Research & Developers
        </label>
        <label style={{ color: '#0458d4', fontStyle:'normal'}}>
          <span><PhoneIcon sx={{m:3, ms:0, zoom:1.5}}/></span>+91 89393 19191
        </label>
        <label style={{ color: '#d40404', fontStyle:'normal' }}>
          <span><AlternateEmailIcon sx={{m:3, ms:0, zoom:1.5}}/></span>sales@tasrnd.in
        </label>
      </CardContent>
    </Card>
    </div>
  )
}
