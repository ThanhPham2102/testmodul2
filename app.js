let inputSearch = document.getElementById("search_input");
let searchBoxLast = document.getElementById("search_box-last11");

function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

inputSearch.addEventListener("keyup", function () {
  searchBoxLast.innerHTML = "";
  getData(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${inputSearch.value}`,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        // getData();
        let userSearch = res[1].filter((name) => {
          // console.log(name, inputSearch.value);
          return name.toLowerCase().startsWith(inputSearch.value);
        });
        console.log("userSearch", userSearch); //loc ten ra

        userSearch.forEach((suggested) => {
          getData(
            `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${suggested}`,
            function (err, res) {
              if (err) {
                console.log(err);
              } else {
                let x = Object.keys(res.query.pages);
                // console.log(x[0]);

                let linkImg = res.query.pages[x].thumbnail.source;
                let linkdes =
                  res.query.pages[x].pageprops["wikibase-shortdesc"];
                searchBoxLast.innerHTML += ` 
                      <div class="search_last">
                      <div align="center" class="search_last--img">
                        <img
                          class="search_last--img1"
                          src="${linkImg}"
                          alt="photo"
                          srcset=""
                        />
                      </div>

                      <div align="left" class="search_last--text">
                        <div class="title">${suggested}</div>
                        <div> <a style= "text-decoration: none"   href="https://en.wikipedia.org/wiki/${suggested}" class="link">${linkdes}</a></div>

                      </div>
                    </div>
                  </div>
                </div>`;
              }
            }
          );
        });
      }
    }
  );
});
