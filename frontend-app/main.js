import { 
  make_thumbnail, read_file, set_active_nav, reload_hIcon, set_pagination
 } from "./utils/library.js";

window.onload = (e) => {
  read_file("components/nav.html")
  .then(html_data => {
    document.getElementById("navigation").innerHTML = html_data;
    set_active_nav("nav_home");
  });
  displayRecent();
  // fetch("http://localhost:8000/app/figure/price?" + new URLSearchParams({code: "FIGURE-175747"}), {
  //     method: "GET"
  // }).then(rsp => rsp.json())
  // .then(data => console.log(data));
};

// submit_btn.addEventListener("click", () => {
//     /* Only server side need to enable cors. Client side if use cors, it will use pre-flight request which will fuck up the request. */
//     fetch("http://localhost:8000/tracker/get", {
//         method: "GET",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//     }).then((rsp) => rsp.json())
//     .then((data) => {console.log(data)})
//     .catch(rsp => {
//         console.log(rsp);
//     })
// })

function displayRecent() {
  // Get page Number
  const urlParams = new URLSearchParams(window.location.search);
  let pageNum = urlParams.get("page");
  if(pageNum == null){
    pageNum = 1;
  }
  
  const content = document.getElementById("displayContent");
  get_recent(pageNum).then((data) => {
    data["results"].forEach((d) => {
      make_thumbnail(content, d, d.img_url);
      document.getElementById(`a_${d.JAN_code}`).onclick = () => reload_hIcon(d.JAN_code);
      // Add event listener on hover
      const detail = document.getElementById(`detail_${d.JAN_code}`);
      detail.addEventListener('mouseenter', (e) => { 
        e.target.classList.add("details-expand"); 
        e.target.classList.remove("details-collapse");
      });
      detail.addEventListener('mouseleave', (e) => { 
        e.target.classList.add("details-collapse"); 
        e.target.classList.remove("details-expand");
      });
    });
    set_pagination(data["metadata"]);
  });
}

async function get_recent(pageNum) {
  const rsp = await fetch(`http://localhost:8000/figures?page=${pageNum}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
  return rsp.json();
}