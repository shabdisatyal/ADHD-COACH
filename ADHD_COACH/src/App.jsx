import './App.css';
import { Card } from '../frontend/components/cardthatremindsyou';
import { imgfolder } from '../frontend/components/cardthatremindsyou';

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
    <div className="App">
      <h1>CAREMEooL</h1>
      <h3 className="introline">{MyUser.present()}</h3>
      <Card images={imgfolder[0].images} label={imgfolder[0].label} />
    </div>
  );
}

export default App;