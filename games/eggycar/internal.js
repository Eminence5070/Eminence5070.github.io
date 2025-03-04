/*var list = [
    {
        "title": "Drift Hunters",
        "url": "https://webglmath.github.io/drift-hunters/",
        "notshow": ['https://webglmath.github.io/drift-hunters/']
    },
    {
        "title": "Moto X3M",
        "url": "https://webglmath.github.io/moto-x3m/",
        "notshow": ['https://webglmath.github.io/moto-x3m/']
    },
    {
        "title": "Cookie Clicker",
        "url": "https://webglmath.github.io/cookie-clicker/",
        "notshow": []
    },
    {
        "title": "Basketball Stars",
        "url": "https://webglmath.github.io/basketball-stars/",
        "notshow": ['https://webglmath.github.io/basketball-stars/']
    },
]
*/
var list = [];

var in_html = "";
for (let index = 0; index < list.length; index++) {
  const element = list[index];
  var currentUrl = location.href;
  if (element.url != currentUrl && !element.notshow.includes(currentUrl)) {
    in_html += `<li style="padding: 5px; display: inline-block;">
        <a style="color: #ffffff;" href="${element.url}" title="${element.title}">${element.title}</a>
      </li>`;
  }
}
var html = `
<ul style="color: #ffffff; padding: 0px; margin: 0px; font-size: 20px;">
  ${in_html}
  <li style="padding: 5px; display: inline-block; float: right;">
    <a onclick="return closeBacklinks();" style="color: #ffffff; text-decoration: none;">❌</a>
  </li>
</ul>
`;
function showHead() {
  var e = this.document.createElement("div");
  e.style =
    "width: 100%; text-align: center; position: absolute; top: 0px; z-index: 999; background: rgb(119, 119, 255); opacity: 0.8;";
  e.innerHTML = html;
  e.id = "listLink";
  document.getElementsByTagName("body")[0].appendChild(e);
}
// window.addEventListener('load', function() {
//     var e = this.document.createElement("div");
//     e.style = "width: 100%; text-align: center; position: absolute; top: 0px; z-index: 999; background: rgb(119, 119, 255); opacity: 0.8;"
//     e.innerHTML = html;
//     e.id="listLink";
//     document.getElementsByTagName('body')[0].appendChild(e);
// });
function closeBacklinks() {
  document.querySelector("#listLink").style.display = "none";
}
