import React, { useState } from "react";
import Heading from "./Heading";
import Footer from "./Footer";
import CreateArea from "./CreateArea";

function App() {
  const [items, setItems] = useState([]);
  console.log(items);

  function addItem(inputText) {
    setItems((prevItems) => {
      return [...prevItems, inputText];
    });
    window.location.reload();
  }

  return (
    <div>
      <Heading />
      <CreateArea onAdd={addItem} />
      <Footer />
    </div>
  );
}
export default App;
