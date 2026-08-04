import './App.css';
import { Card } from '../frontend/components/cardthatremindsyou';
import { textfolder } from '../frontend/components/cardthatremindsyou';
import { NavButtons } from '../frontend/components/seriesofbuttons';

class User {
  constructor(name) {
    this.user = name;
  }

  present() {
    return 'Hi ' + this.user + ', Welcome!';
  }
}

function App() {
  const MyUser = new User("Shea");
  return (
  
  
  <div className='Nonheader'>
    <h1 className='titletext font-fascinate text-4xl ml-3 mt-4 '>CAREMEL</h1>
    <div className=" bg-[#90AB8B] App">
     
    
     
      <Card text ={textfolder[0].text} label={textfolder[0].label} />
      <br/>
       {/* <h3 className="introline">{MyUser.present()}</h3> */}
       <NavButtons/>
      <hr className='mt-0 h-0.5 bg-[#90AB8B] border-0'/>
    </div>
  </div>
    
    

  );
}

export default App;