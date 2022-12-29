# E commerce website
[Demo](https://movie-rent-store-43967.herokuapp.com)

## 點進去首頁，呈現的是當時線上熱門的電影
![](https://i.imgur.com/RMHX3xt.jpg)

## 右上能搜尋出電影，比如說harry potter
![](https://i.imgur.com/dDw3f5O.png)

![](https://i.imgur.com/UysPvrg.jpg)
```
@app.route("/", methods = ["GET", "POST"])
def home():
    global all_movies
    all_movies = []
    if request.method == "POST":
        title = request.form.get("movie_name")
        search_response = requests.get(MOVIE_DB_SEARCH_URL, params={"api_key": MOVIE_DB_API_KEY, "query": title})
        data = search_response.json()
        serch_movies = data["results"]
        all_movies = [movie for movie in serch_movies if movie["poster_path"]]
        return render_template("index.html", movies = all_movies)

    movie_data = default_response.json()
    default_data = movie_data["results"]
    all_movies = [movie for movie in default_data if movie['poster_path']]
    
    return render_template("index.html", movies=all_movies)
```
* 實現方法為在 TMDB 提供的 API 進行 request 並且將電影海報圖列在首頁
* 首頁為列出當時熱門的電影，原因是default_response是以熱門度當搜尋標準的：
```
default_response = requests.get("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key="+MOVIE_DB_API_KEY)
```
* 若是使用右上角的搜尋，那麼進入首頁的方法為"POST"，則會依照搜尋字列出搜尋結果

## 先註冊後就能登入
![](https://i.imgur.com/cYymdXI.png)
![](https://i.imgur.com/YQHV9Gw.png)

## 登入後畫面如此
![](https://i.imgur.com/bIXigoi.jpg)
```
@app.route("/register", methods = ["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        already_exist = User.query.filter_by(email=form.email.data).first()
        if not already_exist:
            hash_pass = generate_password_hash(
                form.password.data,
                method = "pbkdf2:sha256",
                salt_length=8
            )
            new_User = User(
                name = form.name.data,
                email = form.email.data,
                password = hash_pass,
                address = form.address.data
            )
            db.session.add(new_User)
            db.session.commit()
            login_user(new_User)
            return redirect(url_for("home"))
        else:
            flash("You've already signed up with that email, log in instead!", 'error')
            return redirect(url_for("login"))
    return render_template("register.html", form = form, current_user=current_user)

@app.route("/login", methods = ["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        user = User.query.filter_by(email=email).first()
        # Email doesn't exist
        if not user:
            flash("No this user",'error')
            return redirect(url_for("login"))

        # Check stored password hash against entered password hashed
        elif not check_password_hash(user.password, password):
            flash("Password incorrect, please try again.",'error')
            return redirect(url_for("login"))

        # Email exists and password correct
        else:
            login_user(user)
            return redirect(url_for("home"))
    return render_template("login.html", form =form, current_user=current_user)
```
* 註冊帳密會經過加密
    * 在register裡面這樣子實現：
        ```
        hash_pass = generate_password_hash(
                        form.password.data,
                        method = "pbkdf2:sha256",
                        salt_length=8
                    )
        ```
    * 在login裡面這樣子驗證：
        ```
        # Check stored password hash against entered password hashed
        elif not check_password_hash(user.password, password):
            flash("Password incorrect, please try again.",'error')
            return redirect(url_for("login"))
        ```


## 當滑鼠放在圖片上時，圖片卡會翻轉出介紹
![](https://i.imgur.com/zjx1ChQ.png)

## 翻轉字卡，點進open看詳細介紹
![](https://i.imgur.com/Gth26aT.png)


## 點 Add to cart就能將電影放進購物車
![](https://i.imgur.com/1ABoHcr.png)
#### 藍色按鈕中應該為 "Add to cart"才對（在作品中已修正錯誤）
![](https://i.imgur.com/Nxn3tnf.png)
```
@app.route("/show-movie/<id>")
def show_single_movie(id):
    global get_movie
    get_movie=[]
    get_movie = [movie for movie in all_movies if movie["id"] == int(id)]
    if current_user.is_authenticated:
        movie = Cart.query.filter_by(buyer=current_user.email, is_purchased=False, product_id=id).first()
        if movie:
            message = "Added to cart"
        else:
            message = ""
    else:
        message = ""
    try:    
        return render_template("single_movie.html", movie=get_movie[0], message=message, retry = "")
    except:
        return redirect(url_for("show_single_movie", id = id))
```
* 在詳細頁面的地方如何將已在cart的電影列出 "Added to cart"的方法為：
```
movie = Cart.query.filter_by(buyer=current_user.email, is_purchased=False, product_id=id).first()
if movie:
    message = "Added to cart"
else:
    message = ""
```
* 並且在點下藍色按鈕"Add to cart"後，將資料加入到cart資料庫的方法為：
```
@app.route("/add-to-cart/<id>")
def add_to_cart(id):
    if not current_user.is_authenticated:
        return redirect(url_for("login"))
    try:
        movie = get_movie[0]
    except:
        return redirect(url_for("show_single_movie", id = id))
    new_cart_item = Cart(
        product_id =movie["id"],
        title=movie["title"],
        image="https://image.tmdb.org/t/p/w500"+movie["poster_path"],
        price=2,
        is_purchased=False,
        buyer=current_user.email
    )
    db.session.add(new_cart_item)
    db.session.commit()

    return redirect(url_for('show_single_movie', id = id))
```

## 在menu bar 中點進cart 中，可以看到購買商品資訊
![](https://i.imgur.com/gE18ec6.png)
```
@app.route("/cart")
def show_cart():
    if not current_user.is_authenticated:
        return redirect(url_for("login"))
    global payable_amount
    global cart_list
    cart_list = ""
    total_price = 0
    all_items = Cart.query.filter_by(buyer = current_user.email, is_purchased = False).all()
    for item in all_items:
        total_price += item.price
    discount = 0
    if len(all_items) >= 5:
        for _ in range(int(len(all_items)/5)):
            discount += 2
    payable_amount = int(total_price - discount)
    cart_list = ",".join([item.title for item in all_items])
    return render_template("cart.html", cart=all_items, total_price = total_price, payable_amount=payable_amount,
                           public_key = stripe_public_key)
```
* 在購物車中列出尚未付費的電影：
```
all_items = Cart.query.filter_by(buyer = current_user.email, is_purchased = False).all()
```
* 並且依照設定的標準收費（每租五部電影給2元的折扣）：
```
for item in all_items:
        total_price += item.price
    discount = 0
    if len(all_items) >= 5:
        for _ in range(int(len(all_items)/5)):
            discount += 2
    payable_amount = int(total_price - discount)
```


## 在上一步驟中點 Make Payment, 就能進行付費
![](https://i.imgur.com/VLQUUIh.png)
![](https://i.imgur.com/7B5UnCR.png)

## 回到dashboard看，就能看到本來在cart中的Thor已經在租借過的電影中了
![](https://i.imgur.com/gLIGsvB.jpg)