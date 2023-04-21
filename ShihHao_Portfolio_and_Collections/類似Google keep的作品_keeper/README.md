# Keeper MERN
[Demo](https://keeper-react-database.herokuapp.com)
### 用 React 來製作類似於google keep 的作品，還有使用nodejs 和express 以及MongoDB的串接
##  首頁如此
![](https://i.imgur.com/ZrriVuE.png)
是由 Heading.jsx 定義了 Keeper的開頭
```javascript
import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";

function Heading() {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
    </header>
  );
}

export default Heading;
```
還有App.jsx 定義了中間的執行部分：
```javascript=
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
```

## 按下中間 Take a note...會延展開
![](https://i.imgur.com/UxzqLTz.png)

#### 以下code 來自CreatArea.jsx
#### isExpanded預設是false，當按下input form時會，textarea會變大
```jsx=
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
```
#### 當textarea漲大時，＋符號會同時zoom in，這個功能是由mui/material的Zoom和Fab實現的
```jsx=
<Zoom in={isExpanded}>
  <Fab
    onClick={(event) => {
      props.onAdd(inputItem);
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
```
## 按下 + 就可以新增待辦事項
![](https://i.imgur.com/a5KDbSe.png)
#### addItem定義在App.jsx
```jsx=
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
```
#### 當來自CreateArea.jsx中的Fab中的＋符號被按下時，會觸發添加note的功能（在前端畫面添加時也將note添加到後端資料庫）：
```jsx=
<Fab
  onClick={(event) => {
    props.onAdd(inputItem);
    const newKeeper = {
      title: inputItem.title,
      content: inputItem.content,
    };
    axios.post("/posts", newKeeper);
    setInputItem({ title: "", content: "" });

    event.preventDefault();
  }}
>
```

## 按下 垃圾桶符號就能刪除待辦事項
![](https://i.imgur.com/ZoacLMm.png)
#### delete按鈕被設定在每個note上
```jsx=
{posts.map((item, index) => (
  <Note
    key={index}
    id={item._id}
    title={item.title}
    content={item.content}
    onChecked={() => deleteItem(item._id)}
  />
))}
```

```jsx=
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button
        onClick={() => {
          props.onChecked(props.id);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
```
#### 當按下刪除按鈕後會觸發刪除功能（當後端刪除後，重新渲染得到已刪除該note的頁面）：
```jsx=
const deleteItem = (id) => {
  axios
    .delete(`/delete/${id}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  window.location.reload();
};
```

## 以下是我的後端配置：
```javascript=
//Define keeperSchema
const keeperSchema = {
  title: String,
  content: String,
};

const Keeper = mongoose.model("Keeper", keeperSchema);

app.post("/posts", (req, res) => {
  Keeper.create({
    title: req.body.title,
    content: req.body.content,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.get("/posts", (req, res) => {
  Keeper.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

app.delete("/delete/:id", (req, res) => {
  const deleteId = req.params.id;
  Keeper.findByIdAndDelete({ _id: deleteId })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});
```

[source](https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/17038306#overview)

