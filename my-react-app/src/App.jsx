function App() {
  const MyUser= new User("Shea");
  //I want to later add a shuffling feature in this 
  return ( 
    <div className="App">

      <h1> Hey Girls Who Code </h1>
      <h3 className="introline">{MyUser.present()}</h3>

    </div>

  );
}

class User {
        constructor(name) {
          this.user=name;
        }

        present() {
          return 'Hi '+ this.user + 'Welcome!';
        }
      }

export default App; 