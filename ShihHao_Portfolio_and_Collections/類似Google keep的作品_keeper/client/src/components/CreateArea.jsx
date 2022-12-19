import React from "react";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import axios from "axios";
import Note from "./Note";

function CreateArea(props) {
  const [posts, setPosts] = useState([]);
  const [inputItem, setInputItem] = useState({
    title: "",
    content: "",
  });
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteItem = (id) => {
    axios
      .delete(`/delete/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.reload();
    // console.log(id);
  };

  function handleChange(event) {
    const { value, name } = event.target;

    setInputItem((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded ? (
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={inputItem.title}
          />
        ) : null}

        <textarea
          name="content"
          onClick={expand}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
          onChange={handleChange}
          value={inputItem.content}
        />
        <Zoom in={isExpanded}>
          <Fab
            onClick={(event) => {
              props.onAdd(inputItem);
              console.log(inputItem);
              const newKeeper = {
                title: inputItem.title,
                content: inputItem.content,
              };
              axios.post("/posts", newKeeper);
              setInputItem({ title: "", content: "" });

              event.preventDefault();
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
      {posts.map((item, index) => (
        <Note
          key={index}
          id={item._id}
          title={item.title}
          content={item.content}
          onChecked={() => deleteItem(item._id)}
        />
      ))}
    </div>
  );
}

export default CreateArea;
